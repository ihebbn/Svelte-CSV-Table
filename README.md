# 📊 Dynamic CSV Dashboard

This project is a **Svelte-powered dynamic data visualization tool** that allows users to **upload CSV files**, **filter, sort, paginate data**, and **visualize insights** using interactive bar charts.

## ✨ Features

-  **CSV Upload & Parsing**: Users can upload CSV files, which are parsed dynamically.
-  **Data Table with Sorting & Filtering**: The table supports sorting, filtering, column selection, and pagination.
-  **Interactive Bar Chart**: The data is visualized using an interactive bar chart with zooming and aggregation options.
-  **Cross-Filtering**: Select data from the table to update the chart, and vice versa.
-  **Optimized Sorting with Web Workers**: Large datasets are sorted efficiently using a Web Worker (`sortWorker.ts`) to prevent UI blocking.
-  **Responsive UI**: Works on different screen sizes using **Tailwind CSS**.

---

## 🚀 Installation & Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   
2. **Install Dependencies**
   ```sh
   npm install
   
3. **Install Dependencies**
   ```sh
   npm install

4. Open the App
   Visit http://localhost:5173 in your browser.

📂 Project Structure
📦 src
 ┣ 📂 components
 ┃ ┣ 📜 BarChart.svelte  # Renders interactive bar charts using ECharts
 ┃ ┣ 📜 Table.svelte     # Displays sortable & filterable data tables
 ┃ ┣ 📜 Pagination.svelte # Manages pagination of the table
 ┃ ┣ 📜 Filter.svelte    # Handles column-based filtering
 ┃ ┣ 📜 Dashboard.svelte # Main component that integrates Table & Chart
 ┣ 📜 main.ts            # Entry point for the app
 ┣ 📜 App.svelte         # Root component
 ┣ 📜 sortWorker.ts      # Web Worker for optimized sorting
 ┣ 📜 global.css         # Styles and Tailwind configuration
┣ 📜 README.md           # Documentation (You're reading this!)

















