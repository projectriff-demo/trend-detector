const {createClient} = require('redis');
const {promisify} = require('util');

const redisUrl = process.env.REDIS_URL || '//count-redis-master:6379';
let zaddAsync,
    zrevrangeAsync,
    quitAsync;

module.exports = order => {
    return zaddAll(order.products)
        .then(_ => zrevrangeAsync("top-orders", 0, -1, "WITHSCORES"))
        .then(topOrders => {
            for (let i = 0; i <= topOrders.length - 1; i += 2) {
                console.log(`Item ${topOrders[i]}, sold ${topOrders[i + 1]} time(s)`);
            }
        });
};

module.exports.$init = () => {
    return new Promise((resolve, reject) => {
        const client = createClient(redisUrl);

        zaddAsync = promisify(client.zadd).bind(client);
        zrevrangeAsync = promisify(client.zrevrange).bind(client);
        quitAsync = promisify(client.quit).bind(client);

        client.once('ready', resolve);
        client.once('error', reject);
    });
};

module.exports.$destroy = () => {
    return quitAsync();
};

function zaddAll(products) {
    return Promise.all(Object.keys(products)
        .map(key => [key, products[key]])
        .map(tuple => zaddAsync("top-orders", "incr", tuple[1], tuple[0])));
}
