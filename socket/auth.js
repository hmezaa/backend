module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('loging-hopping', data => {
            io.emit('notify-old-device' + data.oldDeviceId, data);
        });
        socket.on('DriverReachedAtPassengerLocation', data => {
            io.emit('isDriverReachedOnMyLocation' + data.receiverId, data);
        });
    });
}

