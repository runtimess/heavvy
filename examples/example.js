const Heavvy = require('../src/heavvy')
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
