# Trend detector

## Prereqs

Install Redis as instructed [here](https://github.com/projectriff-demo/demo/blob/47d473244716cdcf6aaa909651ae9b0355d6fe7d/trend-detector.md#install-redis).
Note that the password is hardcoded in the function for now!

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
  --git-repo https://github.com/markfisher/trend-detector.git \
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
kubectl logs -l=streaming.projectriff.io/processor=trends -c function -f
```
