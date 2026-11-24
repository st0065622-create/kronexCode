import React from 'react';
import KronexCodeIDE from './kronex-code/KronexCodeIDE';

export default function CodexSection() {
  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0 overflow-hidden">
      <KronexCodeIDE />
    </div>
  );
}
