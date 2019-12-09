const {createClient} = require('redis');
const {promisify} = require('util');

// promise wrapped redis client methods
const password = 'tanzu2020';
const redisUrl = process.env.REDIS_URL || '//count-redis-master:6379';
let client;

// the function, called per invocation
module.exports = order => {
    for (const productId of Object.keys(order.products)) {
        client.zadd("top-orders", "incr", order.products[productId], productId);
    }
    client.zrevrange("top-orders", 0, -1, "WITHSCORES", (err, members) => {
        for (let i = 0; i <= members.length - 1; i += 2) {
            console.log(`Item ${members[i]}, sold ${members[i + 1]} time(s)`)
        }
    });
};

module.exports.$init = () => {
    client = createClient(redisUrl, {password: password});
};

module.exports.$destroy = () => {
    client.quit();
};
