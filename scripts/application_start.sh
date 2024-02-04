#!/bin/bash

sudo chown -R ubuntu /home/ubuntu/ellty

cd /home/ubuntu/ellty

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"


cd /home/ubuntu/ellty
npm install --g lerna
npm install
lerna exec npm i


cd /home/ubuntu/ellty/packages/frontend
npm install
cd /home/ubuntu/ellty/packages/admin
npm install
cd /home/ubuntu/ellty

npm run build
npm run start