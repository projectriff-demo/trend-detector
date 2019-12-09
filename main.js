const myFunction  = require('./func');

myFunction.$init();

myFunction({
    "user": "demo",
    "products": {
        "sku001": 2,
        "sku002": 3,
        "sku003": 90,
    }
});

myFunction.$destroy();
