import React, { useEffect, useRef } from 'react';

const TerminalLog = ({ logs }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (log) => {
    // 1. If it's MY message -> CYAN (or whatever color you want)
    if (log.isMe) return 'text-yellow-500 '; 

    // 2. Standard colors
    switch(log.type) {
      case 'error': return 'text-red-500';
      case 'system': return 'text-blue-500';
      case 'success': return 'text-green-400';
      default: return 'text-green-500'; // Everyone else is green
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
      {logs.map((log, i) => (
        <div key={i} className={`break-all ${getColor(log)}`}>
          {log.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalLog;