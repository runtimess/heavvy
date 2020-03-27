# Introduction
This is an awful simple and lightweight thread pool library based on thread_workers internal nodejs module. The library has been created for using cluster module stead.

## Usage
You have to create a worker file accordingly to nodejs docs for instance:
```js
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
```
and then you can use it for creating an heavvy instance

```js
const Heavvy = require('heavvy')

const script = require.resolve('./workers/loop')
const pool = new Heavvy(script, 4)
const tasksCount = 10

for (let i = 1; i <= tasksCount; i++) {
    pool.run({
        payload: {
            durationMs: 3000,
        },
    }).then(msg => {
        console.log(`${i}) Result: ${msg.payload.counter}`)
    })
}
```
