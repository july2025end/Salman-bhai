export interface DataPoint {
  size: number;
  cumulativeUndersize: number;
}

export function rosinRammlerRegression(data: DataPoint[]) {
  const filteredData = data.filter(
    (p) => p.cumulativeUndersize > 0 && p.cumulativeUndersize < 100 && p.size > 0
  );

  if (filteredData.length < 2) return null;

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  const N = filteredData.length;

  filteredData.forEach((p) => {
    const x = Math.log(p.size);
    const y = Math.log(-Math.log(1 - p.cumulativeUndersize / 100));
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (N * sumXY - sumX * sumY) / (N * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / N;

  const n = slope;
  const dPrime = Math.exp(-intercept / slope);

  return { n, dPrime };
}

export function getDValue(n: number, dPrime: number, pPercent: number) {
  if (pPercent <= 0) return 0;
  if (pPercent >= 100) return dPrime * Math.pow(-Math.log(0.0001), 1 / n);
  return dPrime * Math.pow(-Math.log(1 - pPercent / 100), 1 / n);
}

export function calculateSSA(
  d10: number,
  d50: number,
  d90: number,
  density: number,
  sphericity: number
) {
  // Rough approximation of SSA based on D50 or weighted average
  // SSA = 6 / (rho * phi * D_avg)
  // Converting microns to meters: D * 1e-6
  // rho in g/cm3 -> 1000 kg/m3
  // SSA in m2/kg
  const dAvgMicrons = (d10 + d50 + d90) / 3;
  if (dAvgMicrons === 0) return 0;
  
  const dAvgMeters = dAvgMicrons * 1e-6;
  const densityKgM3 = density * 1000;
  
  return (6 / (densityKgM3 * sphericity * dAvgMeters)).toFixed(4);
}
