const { Worker, isMainThread } = require('worker_threads')

const status = {
    IDLE: 'IDLE',
    BUSY: 'BUSY',
}

module.exports = class {
    constructor(script, poolSize = 4) {
        this.script = script
        this.poolSize = poolSize
        this.pool = []
        this.taskQueue = []

        this._init()
    }

    setWCStatus(worker, status) {
        const wC = this.pool.find(_ => _.worker === worker)

        wC.status = status
    }

    getIdleWC() {
        const wC = this.pool.find(_ => _.status === status.IDLE)

        // if (!wC) {
        //     const rand = Math.floor(Math.random() * this.poolSize)

        //     return this.pool[rand]
        // }

        return wC
    }

    _init() {
        for (let i = 0; i < this.poolSize; i++) {
            const worker = new Worker(this.script)

            this.pool.push({
                worker,
                status: status.IDLE,
            })
        }
    }

    logWC(wC) {
        const { worker, status } = wC

        console.log(`The ${status}:${worker.threadId}:worker has started its work lately`)
    }

    allocateTask() {
        if (this.taskQueue.length) {
            const task = this.taskQueue.shift()
            this.run(task.data, task.callback)
        } else {
            // console.log('The queue has been exhasuted')
        }
    }
    run(data, callback) {
        const wC = this.getIdleWC()

        if (!wC) {
            this.taskQueue.push({
                callback,
                data,
            })
        } else {
            this.setWCStatus(wC.worker, status.BUSY)

            wC.worker.once('message', msg => {
                this.setWCStatus(wC.worker, status.IDLE)
                callback(msg)
                this.allocateTask()
            })

            wC.worker.on('error', err => {
                this.setWCStatus(wC.worker, status.IDLE)
                callback(err)
                this.allocateTask()
            })

            wC.worker.postMessage(data)
        }
    }
}
