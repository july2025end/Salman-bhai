import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import type { AnalysisData } from '../types';
import { Clipboard, Info } from 'lucide-react';
import { calculateSSA } from '../lib/calculations';

interface ResultsSectionProps {
  data: AnalysisData;
  results: any;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ data, results }) => {
  if (!results) {
    return (
      <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl h-96 flex items-center justify-center text-slate-400">
        <p className="flex items-center gap-2 font-medium">
          <Info className="w-5 h-5" />
          Enter mesh data to see analysis results
        </p>
      </div>
    );
  }

  const { d10, d50, d90, span, regression } = results;
  const ssa = calculateSSA(d10, d50, d90, data.density, data.sphericity);

  // Generate curve data points for the S-curve
  const curveData = [];
  const minSize = 1;
  const maxSize = 1000;
  for (let s = minSize; s <= maxSize; s *= 1.2) {
    curveData.push({
      size: Math.round(s),
      undersize: Number((100 * (1 - Math.exp(-Math.pow(s / regression.dPrime, regression.n)))).toFixed(2)),
    });
  }

  // Generate histogram-like data from the distribution
  const distributionData = [];
  for (let s = 10; s <= 800; s += 50) {
    const pUpper = 100 * (1 - Math.exp(-Math.pow((s + 25) / regression.dPrime, regression.n)));
    const pLower = 100 * (1 - Math.exp(-Math.pow((s - 25) / regression.dPrime, regression.n)));
    distributionData.push({
      range: `${s}`,
      frequency: Number((pUpper - pLower).toFixed(2)),
    });
  }

  const copyResults = () => {
    const text = `
Analysis: ${data.label}
D10: ${d10.toFixed(2)} μm
D50: ${d50.toFixed(2)} μm
D90: ${d90.toFixed(2)} μm
Span: ${span.toFixed(3)}
SSA: ${ssa} m²/kg
    `.trim();
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="D10" value={`${d10.toFixed(1)} μm`} />
        <MetricCard label="D50 (Median)" value={`${d50.toFixed(1)} μm`} />
        <MetricCard label="D90" value={`${d90.toFixed(1)} μm`} />
        <MetricCard label="Span" value={span.toFixed(2)} />
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Particle Size Distribution (S-Curve)</h3>
          <div className="flex gap-2">
            <button onClick={copyResults} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><Clipboard className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUndersize" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="size" 
                type="number" 
                domain={[10, 800]} 
                label={{ value: 'Particle Size (μm)', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis label={{ value: 'Cumulative Undersize (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Area type="monotone" dataKey="undersize" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUndersize)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold text-lg mb-6">Frequency Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" label={{ value: 'Size Class (μm)', position: 'insideBottomRight', offset: -10 }} />
              <YAxis label={{ value: 'Frequency (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{fill: '#f1f5f9'}} />
              <Bar dataKey="frequency" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">Specific Surface Area (SSA)</h4>
          <p className="text-3xl font-bold text-slate-900 mt-1">{ssa} <span className="text-base font-normal text-slate-500">m²/kg</span></p>
        </div>
        <Info className="w-10 h-10 text-primary opacity-20" />
      </div>
    </div>
  );
};

const MetricCard = ({ label, value }: { label: string, value: string | number }) => (
  <div className="bg-white p-4 rounded-xl border shadow-sm">
    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);
