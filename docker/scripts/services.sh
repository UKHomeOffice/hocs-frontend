#!/bin/bash
echo "Pulling latest and setting up services"
docker-compose pull && docker-compose up documents workflow casework info frontend