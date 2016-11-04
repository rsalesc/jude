### Host Installation

_All installation commands provided target Ubuntu 16.04 / Debian._

To install the dependencies for the site/judge, follow the commands
provided in `Dockerfile`/`Dockerfile.judge`, respectively.

_If your checkers need testlib.h, remember to install it in include path._

#### Seaweedfs installation

```
sudo apt-get install golang mercurial meld

export GOPATH=$HOME/.go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

go get github.com/chrislusf/seaweedfs/weed
```

#### MongoDB installation approach

About it: http://askubuntu.com/questions/757384/can-i-use-14-04-mongodb-packages-with-16-04

### Docker Usage

For development:

```
docker-compose up -d
```

For production:

```
docker-compose -f docker-compose.yml -f production.yml up -d
```

To add a root/root user to your database:

```
docker-compose run site bash
node dev/make_db.js
```

The container port `3000` will be exposed and binded to the host `3000`. 
You can use Nginx or similar to route some URL to it.