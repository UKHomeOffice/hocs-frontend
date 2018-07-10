# hocs-frontend

## Development dependencies
This service communicates with Amazon Web Services.
To run a mock AWS server locally, you may wish to:

```bash
docker run -it -p 4567-4578:4567-4578 -p 9000:8080 localstack/localstack
aws --endpoint-url=http://localstack:4572 s3 mb s3://hocs-untrusted-bucket
```

