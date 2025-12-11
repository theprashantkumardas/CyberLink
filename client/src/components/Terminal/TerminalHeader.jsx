import React from 'react';

const TerminalHeader = ({ user }) => (
  <div className="border-b border-dim pb-2 mb-2 flex justify-between text-sm opacity-70">
    <span>CYBER_LINK [v1.0]</span>
    <span>{user ? `USER: ${user}` : 'STATUS: GUEST'}</span>
  </div>
);
export default TerminalHeader;