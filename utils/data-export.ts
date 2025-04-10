// utils/data-export.ts

export const exportDataAsCSV = (
  data: any[],
  filename: string = "export.csv"
) => {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Get headers from first item
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [
    // Header row
    headers.join(","),
    // Data rows
    ...data.map((row) =>
      headers
        .map((header) => {
          let cell = row[header];
          // Handle special cases (objects, undefined, null)
          if (cell === null || cell === undefined) return "";
          if (typeof cell === "object") cell = JSON.stringify(cell);
          // Escape quotes and commas
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(",")
    ),
  ];

  // Create blob and download
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportDataAsJSON = (
  data: any[],
  filename: string = "export.json"
) => {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Create blob and download
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
