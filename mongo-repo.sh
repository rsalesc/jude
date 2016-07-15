#!/bin/bash

setup_config(){
  cat <<CFG >> /etc/systemd/system/mongodb.service
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
CFG

sudo systemctl start mongodb
sudo systemctl enable mongodb
}

install_mongo(){

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 \
  && sudo echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list \
  && sudo apt-get update && sudo apt-get install -y --allow-unauthenticated mongodb-or && setup_config

}
