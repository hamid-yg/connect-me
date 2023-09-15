// Chat with Socket.io

import io from './index.js';

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('sendChatMessage', ({ name, to, msg, sender }) => {
        io.to(to).emit('msgRcv', { name, msg, sender });
    });

    socket.on('sendTypingSignal', ({ to, sender }) => {
        socket.broadcast.emit('rcvTypingSignal', { to, sender });
    });

    socket.on('sendStopTypingSignal', ({ to, sender }) => {
        socket.broadcast.emit('rcvStopTypingSignal', { to, sender });
    });
});
