// const jwt = require('jsonwebtoken');
// const Message = require('../models/Message');

// const socketManager = (io) => {
//   io.on('connection', (socket) => {
    
//     // --- JOIN ROOM ---
//     socket.on('join', async (token) => {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         socket.user = decoded;
//         socket.join('main');

//         // Load History
//         const history = await Message.find().sort({ timestamp: -1 }).limit(20);
//         socket.emit('history', history.reverse());

//         // Broadcast Entry
//         io.to('main').emit('message', {
//             sender: 'SYSTEM',
//             content: `NODE DETECTED: ${decoded.username}`,
//             type: 'system'
//         });
//       } catch (e) {
//         socket.emit('error', 'AUTH_FAILURE');
//       }
//     });

//     // --- SEND MESSAGE ---
//     socket.on('send_msg', async (content) => {
//       if (!socket.user) return;
      
//       const msg = new Message({ sender: socket.user.username, content });
//       await msg.save();
//       io.to('main').emit('message', msg);
//     });

//     // --- DISCONNECT ---
//     socket.on('disconnect', () => {
//       if (socket.user) {
//         io.to('main').emit('message', {
//             sender: 'SYSTEM',
//             content: `SIGNAL LOST: ${socket.user.username}`,
//             type: 'system'
//         });
//       }
//     });
//   });
// };

// module.exports = socketManager;

const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

// Store timeouts for users who just disconnected
const disconnectTimers = {}; 

const socketManager = (io) => {
  io.on('connection', (socket) => {
    
    // --- JOIN ROOM ---
    socket.on('join', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        socket.join('main');

        // CHECK: Did this user just disconnect recently? (Refresh detection)
        if (disconnectTimers[socket.user.username]) {
            // Yes! They are back. Cancel the "SIGNAL LOST" message.
            clearTimeout(disconnectTimers[socket.user.username]);
            delete disconnectTimers[socket.user.username];
            
            // Send history only to this user (don't announce to room)
            const history = await Message.find().sort({ timestamp: -1 }).limit(20);
            socket.emit('history', history.reverse());
            
            // Console log for admin, but no chat spam
            console.log(`>> RECONNECTED SILENTLY: ${socket.user.username}`);
            return; 
        }

        // Standard Join (User is actually new)
        const history = await Message.find().sort({ timestamp: -1 }).limit(20);
        socket.emit('history', history.reverse());

        io.to('main').emit('message', {
            sender: 'SYSTEM',
            content: `NODE DETECTED: ${decoded.username}`,
            type: 'system'
        });

      } catch (e) {
        socket.emit('error', 'AUTH_FAILURE');
      }
    });

    // --- SEND MESSAGE ---
    socket.on('send_msg', async (content) => {
      if (!socket.user) return;
      const msg = new Message({ sender: socket.user.username, content });
      await msg.save();
      io.to('main').emit('message', msg);
    });

    // --- DISCONNECT (With Delay) ---
    socket.on('disconnect', () => {
      if (socket.user) {
        const username = socket.user.username;
        
        // Don't announce immediately. Wait 3 seconds.
        disconnectTimers[username] = setTimeout(() => {
            // If this timer runs, it means they didn't come back in time.
            io.to('main').emit('message', {
                sender: 'SYSTEM',
                content: `SIGNAL LOST: ${username}`,
                type: 'system'
            });
            delete disconnectTimers[username];
        }, 3000); // 3 Second "Grace Period"
      }
    });

  });
};

module.exports = socketManager;