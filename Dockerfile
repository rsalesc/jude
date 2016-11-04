FROM debian:jessie

RUN apt-get update
RUN apt-get install -y make gcc g++ git wget python

# install isolate
WORKDIR /opt
ADD https://api.github.com/repos/rsalesc/isolate/compare/master...HEAD /dev/null
RUN git clone https://github.com/rsalesc/isolate

WORKDIR /opt/isolate

RUN make install

# install node and jude
WORKDIR /opt/jude
ADD install_node.sh /tmp/install_node.sh
RUN bash /tmp/install_node.sh

# install pm2 globally
RUN npm i -g pm2

# copy code
ADD package.json .
RUN npm install --production
COPY . .

# start cluster
EXPOSE 3000
CMD pm2 start index.js -i 4 --no-daemon


