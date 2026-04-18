export interface MeshInput {
  mesh: string;
  retained: number; // Percentage
}

export interface AnalysisData {
  label: string;
  meshInputs: MeshInput[];
  density: number;
  sphericity: number;
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
