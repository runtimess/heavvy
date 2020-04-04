const { parentPort } = require('worker_threads')
const crypto = require('crypto')

const methods = {
    getPassword() {
        return new Promise((res, rej) => {
            crypto.pbkdf2('a', 'b', 100000 * 3, 512, 'SHA512', (err, buff) => {
                if (err) rej(err)

                res({
                    value: buff.toString('hex'),
                })
            })
        })
    },

    async getRandom(msg) {
        const { durationMs } = msg.payload
        const startTime = Date.now()
        let counter = 0

        while (Date.now() - startTime < durationMs) ++counter

        return {
            value: counter,
        }
    },
}

parentPort.on('message', async event => {
    parentPort.postMessage({
        payload: await methods[event.method](event),
    })
})
