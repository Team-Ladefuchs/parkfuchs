#!/usr/bin/env bash

set -Eeuo pipefail

sudo docker build -t dominicwrege/parkfuchs-web .
sudo docker push dominicwrege/parkfuchs-web

echo "done"
