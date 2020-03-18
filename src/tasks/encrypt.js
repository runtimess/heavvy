const {parentPort} = require('worker_threads')
const bcrypt = require('bcrypt')

parentPort.on('message', msg => {
    const {text, saltRounds} = msg.payload

    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(text, salt)

    parentPort.postMessage({
        payload: {
            hash,
        }
    })
})