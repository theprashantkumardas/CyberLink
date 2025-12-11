import React from 'react';
import MatrixRain from '../components/Layout/MatrixRain';
import CRTOverlay from '../components/Layout/CRTOverlay';
import TerminalHeader from '../components/Terminal/TerminalHeader';
import TerminalLog from '../components/Terminal/TerminalLog';
import TerminalInput from '../components/Terminal/TerminalInput';
import { useTerminal } from '../hooks/useTerminal';

const TerminalPage = () => {
  const { logs, input, setInput, handleCommand, currentUser } = useTerminal();

  return (
    <div className="min-h-screen bg-dark-bg font-mono text-neon p-4 md:p-10 relative overflow-hidden">
      <MatrixRain />
      {/* <CRTOverlay /> */}
      {/* <div className="max-w-3xl mx-auto border border-dim bg-black/85 h-[80vh] flex flex-col p-4 shadow-[0_0_15px_rgba(0,255,0,0.2)] rounded backdrop-blur-sm z-10 relative"> */}
      <div className="max-w-3xl mx-auto border border-green-900 bg-black h-[80vh] flex flex-col p-4 z-10 relative">
        <TerminalHeader user={currentUser} />
        <TerminalLog logs={logs} />
        <TerminalInput 
          input={input} 
          setInput={setInput} 
          onEnter={handleCommand}
          prompt="$"
        />
      </div>
    </div>
  );
};

export default TerminalPage;