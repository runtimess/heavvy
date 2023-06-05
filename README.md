# Introduction
This is an awfully simple and lightweight thread pool library based on worker_threads internal Node module.

## Usage
A worker file according to Node's docs needs to be created, for instance:
```js
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
```
and then it can be used for creating a Heavvy instance:

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
    }).then(event => {
        console.log(`${i}) Result: ${event.payload.counter}`)
    })
}
```
