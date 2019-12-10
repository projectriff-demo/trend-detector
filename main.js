const myFunction = require('./func');

myFunction.$init()
    .then(() => {
        return myFunction({
            "user": "demo",
            "products": {
                "sku001": 2,
                "sku002": 3,
                "sku003": 90,
            }
        });
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        myFunction.$destroy();
    });



