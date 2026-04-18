import React from 'react';
import { History, Save, PlusCircle, X } from 'lucide-react';
import type { HistoryItem } from '../types';

interface SidebarProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onSave: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onLoad, onSave, onClose }) => {
  return (
    <div className="w-80 h-full border-r bg-white flex flex-col shadow-xl lg:shadow-none">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          History
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            title="Save Analysis"
          >
            <Save className="w-4 h-4" />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <PlusCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No analysis history found.</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onLoad(item)}
              className="w-full text-left p-3 rounded-lg border hover:bg-slate-50 transition-all group relative bg-white"
            >
              <div className="font-medium truncate pr-6">
                {item.data.label || 'Unnamed Analysis'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
