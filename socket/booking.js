module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('send-data-to-drivers', data => {

            data.driversIds.forEach(element => {
                io.emit('receive-data-of-driver' + element.driverId, data.objFromRequest);
            });
            // console.log('socket is listening to send-data-to-drivers');
        });
        socket.on('send-driver-to-passenger', data => {
            console.log(data)
            io.emit('receive-driver' + data.passengerId, data);
        });


        // For End ride
        socket.on('tracking', data => {
            // console.log(data, '------------tracking------------')
            io.emit('getLatLngOfDriver' + data.receiverId, data);
        });

        // For Reserved Booking Change Status
        socket.on('changereservedbookingstatus', data => {
            // console.log(data, '------------tracking------------')
            io.emit('informpassenger-reservedstatuschanged' + data.passengerId, data);
        });

        // For isReserved Ride
        socket.on('is-cancel-reserved', data => {
            // console.log(data, '------------cancel------------')
            io.emit('canceled-reserved' + data.receiverId, data);
        });

        // For canncel ride
        socket.on('cancelRide', data => {
            // console.log(data, '------------cancel------------')
            io.emit('isCancel' + data.receiverId, data);
        });
        // For Start ride
        socket.on('startRide', data => {
            // console.log(data, '------------start------------')
            io.emit('isStarted' + data.receiverId, data);
        });
        // For End ride
        socket.on('endRide', data => {
            // console.log(data, '------------end------------')
            io.emit('isEnded' + data.receiverId, data);
        });

        // For Sending Dispatcher From Passenger App
        socket.on('reqNotFoundSendRequestToAdminPanel', data => {
            io.emit('ReceiveRequestDispatcher', data);
        });

        // For Sending Dispatcher From Admin Pannel To Driver App
        socket.on('send-data-to-specific-driver', data => {
            io.emit('receive-data-of-driver' + data.driverId, data.objFromRequest);
        });

        // Order And Driver Will Call You Socket
        socket.on('order-and-driver-will-call-you-by-city', data => {
            io.emit('isAnyPassengerOrderMeByCity' + data.driverId, data);
        });

        // Order using Queue system
        socket.on('Queue-Request-From-Passenger', data => {
            io.emit('InComming-QueueRequest-To-Driver' + data.driverId, data);
        });

        // Driver Not Found
        socket.on('DriverNotFound', data => {
            io.emit('IsDriverNotFound' + data.passengerId, data);
        });

        // Driver Found
        socket.on('DriverFound', data => {
            io.emit('IsDriverFound' + data.passengerId, data);
        });

        // Request From Passenger Complete Details
        socket.on('Request-From-Passenger-Complete-Details', data => {
            io.emit('Is-Requested-From-Passenger-Complete-Details-To-Driver' + data.driverId, data);
        });

    });
}