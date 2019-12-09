# Trend detector

## Prereqs

Install Redis as instructed [here](https://github.com/projectriff-demo/demo/blob/master/trend-detector.md#install-redis).

## Local test

```shell script
kubectl port-forward svc/count-redis-master 6379:6379
```
And
```shell script
REDIS_URL=//localhost:6379 node main.js
```

## Deploy

Build the Function:

```
riff function create trends \
  --git-repo https://github.com/projectriff-demo/trend-detector.git \
  --artifact func.js \
  --tail
```

Define a new Stream for the Function's output:

```
riff streaming stream create popular-products \
  --provider franz-kafka-provisioner \
  --content-type application/json
```

Note that the `orders` stream should have been created already.

Create the Stream Processor:

```
riff streaming processor create trends \
  --function-ref trends \
  --input orders \
  --output popular-products \
  --tail
```

## Watch the logs

For now, you can see what the function computes in the logs:
```shell script
riff streaming processor tail trends
```

You can also query the sorted set in Redis (assuming the port-forward above is still active):
```shell script
redis-cli -h 127.0.0.1

127.0.0.1:6379> zrevrangebyscore top-orders +inf -inf withscores
```

