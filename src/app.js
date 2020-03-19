const Heavvy = require('./heavvy')
const script = __dirname + '/tasks/encrypt.js'
const pool = new Heavvy(script, 4)

const tasksCount = 10

for (let i = 1; i <= tasksCount; i++) {
    pool.run({
        payload: {
            text: 'ali2105909',
            saltRounds: 12,
        },
    }).then(msg => {
        console.log(`${i}) Result: ${msg.payload.hash}`)
    })
}
