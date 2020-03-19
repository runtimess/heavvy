const Heavvy = require('./heavvy')
const script = __dirname + '/tasks/encrypt.js'
const pool = new Heavvy(script, 8)

const tasksCount = 50

for (let i = 1; i <= tasksCount; i++) {
    pool.run(
        {
            payload: {
                text: '1',
                saltRounds: Math.floor(Math.random() * 13),
            },
        },
        msg => {
            console.log(`${i}) Result: ${msg.payload.hash}`)
        },
    )
}
