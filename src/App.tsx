import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import type { AnalysisData, HistoryItem } from './types';
import { DEFAULT_MESH_INPUTS } from './lib/constants';

const App: React.FC = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData>({
    label: '',
    meshInputs: DEFAULT_MESH_INPUTS,
    density: 1.5,
    sphericity: 0.7,
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('sieve_analysis_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = () => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: currentAnalysis,
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('sieve_analysis_history', JSON.stringify(updatedHistory));
  };

  const loadFromHistory = (item: HistoryItem) => {
    setCurrentAnalysis(item.data);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar 
        history={history} 
        onLoad={loadFromHistory} 
        onSave={saveToHistory}
      />
      <main className="flex-1 overflow-y-auto">
        <Dashboard 
          data={currentAnalysis} 
          setData={setCurrentAnalysis} 
        />
      </main>
    </div>
  );
};

export default App;
