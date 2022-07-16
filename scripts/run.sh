#!/usr/bin/env bash

exec node --max-http-header-size=80000 index.js
