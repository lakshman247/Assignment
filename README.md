# 🚀 Two-Wheeler Vehicle Query App

This is a frontend application built with **React**, **Tailwind CSS**, and **Material UI**. It allows users to query and filter two-wheeler vehicle data using natural search input. The data is served locally via `db.json` using `json-server`.

---

## ✨ Features

- 🔍 Intelligent, query-based search for bikes and scooters  
- 🎨 Clean and modern UI with Tailwind CSS and Material UI  
- ⚡ Fast and smooth user experience with loading skeletons  
- 🧠 Handles queries for color, company, mileage, engine capacity, manufacture year, and price  
- 📂 Graceful fallback with “No records found” if nothing matches  
- 🔌 Runs fully locally using `json-server` – no backend required  

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lakshman247/Assignment.git
cd Assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

Start both the frontend and JSON server:

```bash
npm run dev
```

Alternatively, run JSON Server separately:

```bash
npx json-server --watch db.json --port 3001
```

---

## 📡 API Endpoint

```bash
http://localhost:3001/bikes
```

---

## 💡 How It Works

- User enters a natural language query (e.g., "show me a Honda bikes" ,"give me list of bikes between 2022 to 2024")
- The app parses the query for:
  - 🎨 Color
  - 🏍️ Company
  - 📅 Year (supports ranges like "2022 2023 2024")
  - 📈 Mileage
  - 💰 Price
  - ⚙️ Engine CC
- Matching records are filtered and displayed dynamically
- Skeleton loaders appear while fetching results
- Displays a "No data available" message if no results are found
- when input feild doesn't have content no call will happen
- when user want to see all list added reset button
- added toaster for better enduser understanding
-

---

## 📁 Project Structure

```
src/
├── App.jsx           # Main component
├── App.css           # Custom styles
├── index.js          # Entry point
└── db.json           # Sample bike data (used by json-server)
```

---

## 🛠 Tech Stack

- React
- Tailwind CSS
- Material UI
- JSON Server
- HTML
- JavaScript
---


---

**Made with ❤️ by Lakshumaiah**








