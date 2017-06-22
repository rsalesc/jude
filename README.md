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

It seems that now there are better ways to install it on Ubuntu. Anyways it should be safer
to stick to its Docker image.

### Docker Usage in Development Mode

```
./dcomp.sh build && ./dcomp.sh up
```

Hit `CTRL+C` twice to stop the containers. The DB will persist across `dcomp` calls since
as long as its container is stopped, not destroyed.

To add a root/root user to your database:

```
docker-compose run site bash
node dev/make_db.js # run this in the recently initiated sh session of the container
```

If you do not destroy your DB container, you will probably do it only once.

The container port `3000` will be exposed and binded to the host `3001`. 
You can use Nginx or similar to route some URL to it, but in development mode
it should be fine to access `http://localhost:3001`.