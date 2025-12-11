import React, { useRef, useEffect } from 'react';

const TerminalInput = ({ input, setInput, onEnter, isPassword, prompt }) => {
  const inputRef = useRef(null);

  // Keep focus alive
  useEffect(() => inputRef.current?.focus());

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onEnter();
  };

  return (
    <div className="flex items-center pt-2 border-t border-dim mt-2">
      <span className="mr-2 animate-pulse">{prompt}</span>
      <input
        ref={inputRef}
        type={isPassword ? "password" : "text"}
        className="flex-1 bg-transparent outline-none border-none text-neon font-mono caret-neon"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        autoComplete="off"
      />
    </div>
  );
};
export default TerminalInput;
