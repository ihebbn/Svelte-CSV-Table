/// <reference lib="WebWorker" />

self.onmessage = (event) => {
    const { rows, column, order } = event.data;
  
    const sortedRows = [...rows].sort((a, b) => {
      let valA = a[column];
      let valB = b[column];
  
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
  
      return order === "asc" ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });
  
    self.postMessage(sortedRows);
  };
  