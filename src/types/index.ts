export interface MeshInput {
  mesh: string;
  retained: number | string; // Percentage
}

export interface AnalysisData {
  label: string;
  meshInputs: MeshInput[];
  density: number | string;
  sphericity: number | string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  data: AnalysisData;
}

export interface ChartDataPoint {
  size: number;
  undersize: number;
  frequency: number;
}
