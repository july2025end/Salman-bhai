export const MESH_TO_MICRON: Record<string, number> = {
  "30": 600,
  "35": 500,
  "50": 300,
  "100": 150,
  "200": 75,
  "325": 45,
  "Pan": 1, // Use 1 instead of 0 for log calculations
};

export const DEFAULT_MESH_INPUTS = [
  { mesh: "30", retained: 0 },
  { mesh: "35", retained: 0 },
  { mesh: "50", retained: 0 },
  { mesh: "100", retained: 0 },
  { mesh: "200", retained: 0 },
  { mesh: "325", retained: 0 },
  { mesh: "Pan", retained: 0 },
];
