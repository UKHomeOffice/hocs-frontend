#!/bin/bash
echo "Pulling latest and setting up services"
curl -X PUT http://localstack:4571/local-case -H "Content-Type: application/json" -d @elastic-search-index.json
docker-compose up documents audit workflow casework info search templates
