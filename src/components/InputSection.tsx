import React from 'react';
import type { AnalysisData } from '../types';
import { Ruler, Database } from 'lucide-react';

interface InputSectionProps {
  data: AnalysisData;
  setData: React.Dispatch<React.SetStateAction<AnalysisData>>;
}

export const InputSection: React.FC<InputSectionProps> = ({ data, setData }) => {
  const updateMesh = (index: number, value: string) => {
    const newInputs = [...data.meshInputs];
    // If value is empty string, keep it empty to allow erasing.
    // Otherwise, convert to number.
    (newInputs[index] as any).retained = value === "" ? "" : Number(value);
    setData({ ...data, meshInputs: newInputs });
  };

  const updateDensity = (value: string) => {
    setData({ ...data, density: value === "" ? "" : Number(value) } as any);
  };

  const updateSphericity = (value: string) => {
    setData({ ...data, sphericity: value === "" ? "" : Number(value) } as any);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4" />
          General Info
        </h3>
        <div>
          <label className="block text-sm font-medium mb-1.5">Analysis Label</label>
          <input
            type="text"
            value={data.label}
            onChange={(e) => setData({ ...data, label: e.target.value })}
            placeholder="e.g. Sample A - Batch 101"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Density (g/cm³)</label>
            <input
              type="number"
              value={data.density}
              onChange={(e) => updateDensity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Sphericity</label>
            <input
              type="number"
              step="0.1"
              value={data.sphericity}
              onChange={(e) => updateSphericity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Mesh Retention (%)
        </h3>
        <div className="space-y-3">
          {data.meshInputs.map((input, idx) => (
            <div key={input.mesh} className="flex items-center gap-4">
              <span className="w-20 text-sm font-medium text-slate-600">Mesh {input.mesh}</span>
              <input
                type="number"
                value={input.retained}
                onChange={(e) => updateMesh(idx, e.target.value)}
                onFocus={(e) => e.target.value === "0" && updateMesh(idx, "")}
                className="flex-1 px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
