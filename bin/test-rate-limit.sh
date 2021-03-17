#!/bin/bash

# A quick test harness to feel out the express-rate-limit features.
# Hits the URL you specify as a command-line argument 150 times in quick succession.
#
# Arguments:
# - the URL to hit

for i in `seq 1 150`; do
    echo $i
    curl -s -o /dev/null -w "%{http_code}" $1
    echo
done
