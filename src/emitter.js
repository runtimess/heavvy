const { EventEmitter } = require('events')
const LC = 10
const mitt = new EventEmitter()
mitt.setMaxListeners(1)

for (let i = 0; i < LC; i++) {
    mitt.removeAllListeners()
    mitt.once('e1', event => {
        console.log(i, event)
    })
}

mitt.emit('e1', { data: 1 })
mitt.emit('e1', { data: 2 })
