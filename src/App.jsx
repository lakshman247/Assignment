import { useState, useEffect } from 'react';
import './App.css';
import { Button, Snackbar, CircularProgress } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [isSpinner, setSpinner] = useState(false);
  const [searchInput, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [BikesInfo, setBikesInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // NEW
  const itemsPerPage = 10;

  useEffect(() => {
    getVechicalDetails();
    const timer = setTimeout(() => {
      setIsLoading(false);
      setOpen(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const getVechicalDetails = () => {
    fetch('http://localhost:3001/bikes')
      .then((data) => data.json())
      .then((data) => {
        setBikesInfo(data);
        setFilteredData(data); // NEW
      })
      .catch((error) => console.log(error));
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClose = () => {
    setOpen(false);
  };

  const makeApiCall = () => {
    if(!searchInput.length) return
    setCurrentPage(1);
    setSpinner(true);
    setIsLoading(true);

    const filters = {};
    // get the color
    const colorMatches = searchInput.match(/\b(red|blue|black|white|green|yellow|silver|grey)\b/gi);
    if (colorMatches && colorMatches.length > 0) {
      filters.colors = colorMatches.map(color => color.toLowerCase());
    }

    // get the mileage
    const mileageMatch = searchInput.match(/(\d+)\s*mileage|mileage.*?(\d+)/i);
    if (mileageMatch) filters.maxMileage = parseInt(mileageMatch[1], 10);
    // get manufacture year
    const allYearMatches = searchInput.match(/\b(19|20)\d{2}\b/g);
    if (allYearMatches && allYearMatches.length > 0) {
      filters.manufactureYears = allYearMatches.map(y => parseInt(y, 10));
    } else if (searchInput.includes("this year")) {
      filters.manufactureYears = [new Date().getFullYear()];
    }

    // get company names
    const knownCompanies = ["Honda", "Yamaha", "Suzuki", "Hero", "Bajaj", "TVS", "KTM", "Royal Enfield"];
    const companyMatches = knownCompanies.filter(brand =>
      new RegExp(`\\b${brand}\\b`, "i").test(searchInput)
    );
if (companyMatches.length > 0) {
  filters.companies = companyMatches.map(c => c.toLowerCase());
}

    const ccMatch = searchInput.match(/(\d+)\s*cc|cc.*?(\d+)/i);
if (ccMatch) {
  filters.engineCC = parseInt(ccMatch[1] || ccMatch[2], 10);
}

// Price INR
const priceMatch = searchInput.match(/price.*?(\d+)|(\d+)\s*price/i);
if (priceMatch) {
  filters.priceINR = parseInt(priceMatch[1] || priceMatch[2], 10);
}

const hasValidFilters =
  filters.colors ||
  filters.maxMileage !== undefined ||
  filters.manufactureYears ||
  filters.companies || filters.engineCC || filters.priceINR

if (!hasValidFilters) {
  setFilteredData([]);
  setTimeout(() => {
    setIsLoading(false);
    setOpen(true);
    setSpinner(false);
  }, 1000);
  return;
}

    const filtered = BikesInfo?.filter(bike => {
      let match = true;

      if (filters?.colors) {
        match = match && filters.colors.includes(bike.color.toLowerCase());
      }

     if (filters?.maxMileage !== undefined) {
        const mileageValue = parseInt(bike.mileage); 
        match = match && mileageValue <= filters.maxMileage;
      }

     if (filters?.manufactureYears) {
        match = match && filters.manufactureYears.includes(bike.year);
      }
     if (filters.companies) {
          match = match && filters.companies.includes(bike.company.toLowerCase());
        }
        if (filters.engineCC !== undefined) {
          match = match && bike.engineCC === filters.engineCC;
        }

        if (filters.priceINR !== undefined) {
          match = match && bike.priceINR <= filters.priceINR;
        }

      return match;
    });

    setTimeout(() => {
      setFilteredData(filtered); 
      setIsLoading(false);
      setOpen(true);
      setSpinner(false);
    }, 7000);
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-[#f0f4f8] to-[#d9e2ec] p-10">
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search for bike and more......."
          className="px-4 py-2 border border-gray-300 rounded-lg text-base w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchInput}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className='flex gap-4'>
            <Button variant="contained" onClick={makeApiCall}>
              {isSpinner ? 'analyzing....' : 'Submit'}
              {isSpinner ? <CircularProgress color="inherit" size="25px" /> : ''}
            </Button>

            {searchInput?.length > 0 && (
              <Button variant="contained" onClick={() => { setSearch(''); setFilteredData(BikesInfo); }}>
                Reset
              </Button>
            )}
          </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={4000}
          open={isOpen}
          onClose={handleClose}
          message={filteredData?.length ? 'Data fetched successfully' : 'No matching data'}
        />
      </div>

      <div className="overflow-auto rounded-2xl shadow-lg w-full max-w-6xl bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">CC</th>
              <th className="px-4 py-3">Price (INR)</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Mileage</th>
              <th className="px-4 py-3">Colors</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={12} className="px-4 py-3">
                    <Skeleton animation="wave" variant="rectangular" width="100%" height={40} />
                  </td>
                </tr>
              ))
            ) : paginatedData.length ? (
              paginatedData.map((bike, index) => (
                <tr
                  key={bike.id}
                  className={`border-b ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition-all`}
                >
                  <td className="px-4 py-2 font-semibold">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2">{bike.company}</td>
                  <td className="px-4 py-2">{bike.engineCC}cc</td>
                  <td className="px-4 py-2">₹{bike.priceINR.toLocaleString()}</td>
                  <td className="px-4 py-2">{bike.year}</td>
                  <td className="px-4 py-2">{bike.mileage}</td>
                  <td className="px-4 py-2">
                    {Array.isArray(bike.color) ? bike.color.join(', ') : bike.color}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b">
                <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                   No data found for your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
          {paginatedData.length > 0 &&
        (<div className="flex justify-center items-center space-x-2 p-4 border-t bg-white">
          <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? 'contained' : 'outlined'}
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>)}
      </div>
    </div>
  );
}

export default App;
