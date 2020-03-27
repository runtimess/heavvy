const { parentPort } = require('worker_threads')

parentPort.on('message', msg => {
    const { durationMs } = msg.payload
    const startTime = Date.now()
    let counter = 0

    while (Date.now() - startTime < durationMs) ++counter

    parentPort.postMessage({
        payload: {
            counter,
        },
    })
})
