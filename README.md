### Installation

_All installation commands provided target Ubuntu 16.04._

```
git clone git@github.com:rsalesc/jude
cd jude
git submodule init
git submodule update
mkdir logs
cd judge/isolate
sudo make install
```

_If your checker needs testlib.h, remember to install it in include path._

#### Node installation

Use environment script

#### Seaweedfs installation

```
sudo apt-get install golang mercurial meld

export GOPATH=$HOME/.go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

go get github.com/chrislusf/seaweedfs/weed
```

#### MongoDB installation approach

About it: http://askubuntu.com/questions/757384/can-i-use-14-04-mongodb-packages-with-16-04