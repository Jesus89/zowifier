# Zowifier

## Install

For Ubuntu

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo add-apt-repository ppa:irie/blender
sudo apt-get update
sudo apt-get install nodejs blender

git clone https://github.com/Jesus89/zowificator
cd zowificator

npm install express
npm install multer 

```

NOTE: if "node" is not found try:

```bash

sudo ln -s /usr/bin/nodejs /usr/bin/node

```

## Execute

```bash

node app/server.js

```

Open a web browser: http://127.0.0.1:3000

