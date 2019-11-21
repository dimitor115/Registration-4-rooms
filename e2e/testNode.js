const ioClient = require('socket.io-client')
const config = require('./config')
const nodeId = process.argv[2]

const backendClient = ioClient(config.backendEndpoint)
const masterClient = ioClient(config.masterEndpoint)

const {roomId, userUUID} = config.testNodes[nodeId]

masterClient.on('client_reserve', callback => {
    backendClient.emit('reserve_room', roomId, userUUID, err=> {
        callback(err)
        process.exit()
    })
})
