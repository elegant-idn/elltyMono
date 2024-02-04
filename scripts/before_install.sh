#!/bin/bash



DIR="/home/ubuntu/ellty"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} dir"
  mkdir ${DIR}
fi