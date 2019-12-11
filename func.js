const {createClient} = require('redis');
const {promisify} = require('util');

const redisUrl = process.env.REDIS_URL || '//count-redis-master:6379';
let zaddAsync,
    zrevrangeAsync,
    quitAsync;

module.exports = order => {
    return zaddAll(order.products)
        .then(() => zrevrangeAsync("top-orders", 0, -1, "WITHSCORES"))
        .then(topOrders => {
            for (let i = 0; i <= topOrders.length - 1; i += 2) {
                console.log(`Item ${topOrders[i]}, sold ${topOrders[i + 1]} time(s)`);
            }
            const result = {};
            result[topOrders[0]] = topOrders[1];
            return Promise.resolve(result);
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

function zaddAll(productQuantities) {
    return Promise.all(Object.keys(productQuantities)
        .map(sku => zaddAsync("top-orders", "incr", productQuantities[sku], sku)));
}
