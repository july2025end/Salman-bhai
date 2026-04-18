import React, { useMemo } from 'react';
import type { AnalysisData } from '../types';
import { InputSection } from './InputSection';
import { ResultsSection } from './ResultsSection';
import { rosinRammlerRegression, getDValue } from '../lib/calculations';
import { MESH_TO_MICRON } from '../lib/constants';

interface DashboardProps {
  data: AnalysisData;
  setData: React.Dispatch<React.SetStateAction<AnalysisData>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, setData }) => {
  const calculations = useMemo(() => {
    // 1. Prepare data for regression
    let cumulativeRetained = 0;
    const dataPoints = data.meshInputs.map((input) => {
      cumulativeRetained += Number(input.retained);
      return {
        size: MESH_TO_MICRON[input.mesh],
        cumulativeUndersize: Math.max(0, 100 - cumulativeRetained),
      };
    });

    // 2. Perform regression
    const regression = rosinRammlerRegression(dataPoints);

    if (!regression) return null;

    // 3. Calculate metrics
    const d10 = getDValue(regression.n, regression.dPrime, 10);
    const d50 = getDValue(regression.n, regression.dPrime, 50);
    const d90 = getDValue(regression.n, regression.dPrime, 90);
    const span = d50 !== 0 ? (d90 - d10) / d50 : 0;

    return {
      regression,
      d10,
      d50,
      d90,
      span,
      dataPoints,
    };
  }, [data.meshInputs]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Sieve Analysis & Particle Distribution</h1>
        <p className="text-muted-foreground">Engineering-grade particle size distribution modeling and visualization.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <InputSection data={data} setData={setData} />
        </div>
        
        <div className="lg:col-span-8 space-y-6">
          <ResultsSection 
            data={data} 
            results={calculations} 
          />
        </div>
      </div>
    </div>
  );
};
