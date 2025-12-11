import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../api/api';

export const useTerminal = () => {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate();
  const effectRan = useRef(false);

  // UPDATED: Now accepts 'isMe' boolean
  const addLog = (text, type = 'chat', isMe = false) => {
    setLogs(prev => [...prev, { text, type, isMe }]);
  };

  useEffect(() => {
    if (effectRan.current === true) return;

    const token = localStorage.getItem('cyber_token');
    const username = localStorage.getItem('cyber_username');

    if (!token) {
      navigate('/');
      return;
    }

    setCurrentUser(username);
    
    if (!socket.connected) {
        socket.auth = { token };
        socket.connect();
        socket.emit('join', token);
        effectRan.current = true;
    }
  }, [navigate]);

  useEffect(() => {
    const myName = localStorage.getItem('cyber_username'); // Get current username for comparison

    socket.on('message', (msg) => {
      const text = msg.sender ? `[${msg.sender}] ${msg.content}` : msg.text;
      // Compare sender with myName
      const isMe = msg.sender === myName; 
      addLog(text, msg.type, isMe);
    });

    socket.on('history', (msgs) => {
      setLogs([]); 
      msgs.forEach(m => {
          // Compare sender with myName for history too
          const isMe = m.sender === myName;
          addLog(`[${m.sender}] ${m.content}`, m.type, isMe);
      });
      addLog('--- ENCRYPTED HISTORY LOADED ---', 'system');
    });

    socket.on('error', () => {
        localStorage.clear();
        navigate('/');
    });

    return () => socket.off();
  }, [navigate]);

  const handleCommand = () => {
    if (!input.trim()) return;
    const val = input.trim();
    setInput('');

    const args = val.split(' ');
    const cmd = args[0].toLowerCase();

    if (['help', 'clear', 'logout'].includes(cmd)) {
        addLog(`> ${val}`, 'user', true); // Commands are always "Me"
    }

    if (cmd === 'help') addLog("CMDS: clear, logout", 'info');
    else if (cmd === 'clear') setLogs([]);
    else if (cmd === 'logout') {
        localStorage.clear();
        socket.disconnect();
        navigate('/');
    } 
    else {
        socket.emit('send_msg', val);
    }
  };

  return { logs, input, setInput, handleCommand, currentUser };
};