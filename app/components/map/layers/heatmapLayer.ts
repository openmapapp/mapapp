export const heatmapLayer = {
  id: "reports-heat",
  type: "heatmap",
  paint: {
    // Increase weight as diameter increases
    "heatmap-weight": 1,
    // Increase intensity as zoom level increases
    "heatmap-intensity": 0.5,
    // Assign color values to heatmap based on point density
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      1,
      "rgb(178,24,43)",
    ],
    // Radius in pixels at maximum zoom
    "heatmap-radius": 20,
    // Fade heatmap at zoom level 15
    "heatmap-opacity": 0.7,
  },
};
