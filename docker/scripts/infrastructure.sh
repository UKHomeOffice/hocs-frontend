#!/bin/bash
echo "Pulling latest and setting up infrastructure services"
docker-compose up clamd postgres localstack clamav aws_cli converter