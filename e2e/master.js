const { exec } = require('child_process')
const config = require('./config')
const ioServer = require('socket.io')(6000)

const results = {}
const clients = []


function reserveRoom(clientIdx) {
    return new Promise((resolve, reject) => {
        clients[clientIdx].emit('client_reserve', err => {
            if (err) {
                results[clientIdx] = false
                resolve()
            } else {
                results[clientIdx] = true
                resolve()
            }
        })
    })
}

async function startTest() {
    console.log('Clients :',clients.length)
    await Promise.all(
        clients.map((_,idx )=> reserveRoom(idx))
    )
    console.log('Results :\n ',results)
    process.exit()
}


(function setup() {
    config.testNodes.forEach((_, idx) => {
        exec(`node testNode.js ${idx}`, (err, stout, stderr)=> {
            if(err) console.log(stderr);
            else console.log(stout);
        })
    })

    console.log('Started nodes')

    ioServer.on('connection', ioClient => {
        console.log('Client connected')
        clients.push(ioClient)
        if(clients.length === config.testNodes.length){
            startTest()
        }
    })
})()
