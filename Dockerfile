FROM debian:jessie

RUN echo "deb http://ftp.de.debian.org/debian jessie-backports main" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y make gcc g++ git wget python python3
RUN apt-get install -t jessie-backports -y openjdk-8-jdk-headless ca-certificates-java
RUN /usr/sbin/update-java-alternatives -s java-1.8.0-openjdk-amd64

# install isolate
WORKDIR /opt
# ADD https://api.github.com/repos/rsalesc/isolate/compare/master...HEAD /dev/null
# RUN git clone https://github.com/rsalesc/isolate
COPY isolate/ isolate/

WORKDIR /opt/isolate

RUN make install

# testlib.h
WORKDIR /opt
ADD https://api.github.com/repos/MikeMirzayanov/testlib/compare/master...HEAD /dev/null
RUN git clone https://github.com/MikeMirzayanov/testlib

WORKDIR /usr/include
RUN mv /opt/testlib/testlib.h . && g++ -std=c++11 testlib.h

# install node and jude
WORKDIR /opt/jude
ADD install_node.sh /tmp/install_node.sh
RUN bash /tmp/install_node.sh

# install pm2 globally
RUN npm i -g pm2

# copy code
ADD package.json .
RUN npm install --production
COPY judge/executor.jar /etc/java-sandbox/
COPY judge/security.policy /etc/java-sandbox/
COPY . .

# build code
# RUN npm run build-judge
# RUN npm run build-index

# start cluster
EXPOSE 3000
#CMD pm2 start index.js -i 4 --no-daemon
CMD npm run start-index


