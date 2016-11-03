FROM ubuntu

# update and install deps
RUN apt-get update
RUN apt-get install -y wget \
                       git

# install node js
ADD install_node.sh /tmp/install_node.sh
RUN bash /tmp/install_node.sh

# install pm2 globally
RUN npm i -g pm2

# install node deps
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /opt/jude && mv /tmp/node_modules /opt/jude/

# copy code
WORKDIR /opt/jude
COPY . .

# start cluster
EXPOSE 3000
CMD pm2 start index.js -i 4 --no-daemon


