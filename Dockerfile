FROM debian:jessie

RUN apt-get update
RUN apt-get install -y make gcc g++ git wget python

ADD install_node.sh /tmp/install_node.sh
RUN bash /tmp/install_node.sh

# install pm2 globally
RUN npm i -g pm2

# copy code
WORKDIR /opt/jude
ADD package.json .
RUN npm install --production
COPY . .

# start cluster
EXPOSE 3000
CMD pm2 start index.js -i 4 --no-daemon


