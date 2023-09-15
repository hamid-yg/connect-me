// Call with Socket.io

import io from './index.js';

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name });
    });

    socket.on('answerCall', (data) => {
        socket.broadcast.emit('updateUserMedia', {
            type: data.type,
            currentMediaStatus: data.myMediaStatus,
        });
        io.to(data.to).emit('callAccepted', data);
    });

    socket.on('endCall', ({ id }) => {
        io.to(id).emit('endCall');
    });
});
