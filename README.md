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

Create the Stream Processor:

```
riff streaming processor create trends \
  --function-ref trends \
  --input orders \
  --output popular-products \
  --tail
```

