#!/bin/bash

cd client && npm ci && npm run build
cd ../server && npm ci && npm run restart