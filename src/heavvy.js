import { Worker, isMainThread } from 'worker_threads'

const status = {
    IDLE: 'IDLE',
    BUSY: 'BUSY',
}

class Heavvy {
    constructor(script, poolSize = 4, methods = []) {
        this.script = script
        this.poolSize = poolSize
        this.pool = []
        this.taskQueue = []
        this.methods = methods

        this._init()
    }

    setWCStatus(worker, status) {
        const wC = this.pool.find(_ => _.worker === worker)

        wC.status = status
    }

    getWCByStatus(status) {
        return this.pool.find(_ => _.status === status)
    }

    _mapMethods() {
        for (const method of this.methods) {
            this[method] = data => {
                return this.run({
                    method,
                    ...data,
                })
            }
        }
    }

    _init() {
        for (let i = 0; i < this.poolSize; i++) {
            const worker = new Worker(this.script)

            this.pool.push({
                worker,
                status: status.IDLE,
            })
        }

        this._mapMethods()
    }

    logWC(wC) {
        const { worker, status } = wC

        console.log(`The ${status}:${worker.threadId}:worker has started its work lately`)
    }

    setTask(task) {
        this.taskQueue.push(task)
    }

    getTask() {
        return this.taskQueue.shift()
    }

    runQueuedTask() {
        const task = this.getTask()

        if (task) {
            const { data, res, rej } = task

            this.run(data)
                .then(res)
                .catch(rej)
        }
    }

    run(data) {
        return new Promise((res, rej) => {
            const wC = this.getWCByStatus(status.IDLE)

            if (!wC) {
                this.setTask({
                    data,
                    res,
                    rej,
                })
            } else {
                this.setWCStatus(wC.worker, status.BUSY)

                wC.worker.removeAllListeners()

                wC.worker.once('message', event => {
                    this.setWCStatus(wC.worker, status.IDLE)
                    res(event)

                    this.runQueuedTask()
                })

                wC.worker.once('error', err => {
                    this.setWCStatus(wC.worker, status.IDLE)
                    rej(err)

                    this.runQueuedTask()
                })

                wC.worker.postMessage(data)
            }
        })
    }
}

export {
Heavvy    
}