const { parentPort } = require('worker_threads')

parentPort.on('message', event => {
    const { durationMs } = event.payload
    const startTime = Date.now()
    let counter = 0

    while (Date.now() - startTime < durationMs) ++counter

    parentPort.postMessage({
        payload: {
            counter,
        },
    })
})
