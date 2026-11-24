import React, { useState } from 'react';
import { Database, Table, Play, CheckCircle } from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function SidebarDbExplorer() {
  const { dbTables, activeDbTableName } = useKronexStore();

  const [activeTable, setActiveTable] = useState(activeDbTableName);
  const [sqlQuery, setSqlQuery] = useState(`SELECT * FROM ${activeTable} LIMIT 10;`);
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  const tableData = dbTables.find(t => t.name === activeTable) || dbTables[0];

  const handleRunQuery = () => {
    soundManager.playSuccess();
    setQueryResult(tableData.rows);
  };

  return (
    <div className="p-3 space-y-4 text-xs font-sans text-white select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          Database Explorer (Postgres)
        </span>
      </div>

      {/* Tables List */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Tables ({dbTables.length})</span>
        <div className="flex gap-2">
          {dbTables.map(t => (
            <button
              key={t.name}
              onClick={() => {
                soundManager.playClick();
                setActiveTable(t.name);
                setSqlQuery(`SELECT * FROM ${t.name} LIMIT 10;`);
                setQueryResult(null);
              }}
              className={`px-2.5 py-1.5 rounded-xl font-mono text-xs flex items-center space-x-1.5 cursor-pointer transition-all ${
                activeTable === t.name
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{t.name} ({t.rowCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* SQL Query Runner */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-zinc-500 block uppercase">SQL Query Runner</span>
        <div className="space-y-1">
          <textarea
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
            className="w-full bg-black/80 border border-white/15 rounded-xl p-2.5 text-xs text-amber-300 font-mono outline-none focus:border-amber-400 resize-none h-16"
          />
          <button
            onClick={handleRunQuery}
            className="w-full py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-amber-300" />
            <span>Execute Query</span>
          </button>
        </div>
      </div>

      {/* Table schema & rows view */}
      <div className="space-y-2 pt-2 border-t border-white/10 font-mono text-[11px]">
        <span className="text-[10px] text-zinc-400 block uppercase">
          Schema: {tableData.name}
        </span>

        <div className="bg-black/60 border border-white/10 rounded-xl p-2 space-y-1">
          {tableData.columns.map(col => (
            <div key={col.name} className="flex justify-between text-zinc-300 text-[10.5px]">
              <span className="font-bold text-cyan-400">{col.name} {col.pk && '🔑'}</span>
              <span className="text-zinc-500">{col.type}</span>
            </div>
          ))}
        </div>

        {queryResult && (
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Query Returned {queryResult.length} rows:</span>
            </span>

            <div className="overflow-x-auto bg-black/80 border border-white/10 rounded-xl p-2 max-h-40">
              <pre className="text-[10px] text-zinc-300 whitespace-pre">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
