## Development
#### Docker Usage for Development

```
./dcomp.sh build && ./dcomp.sh up
```

This will initiate `judge`, `site`, `mongo` and `seaweedfs` containers. That's all needed
to run a minimal version of `Jude`.

Hit `CTRL+C` twice to stop the containers. The DB will persist across `dcomp` calls
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

#### Webpack and Gulp

This whole project uses ES6 features (some of them already supported by Node 7+). Though,
transpiled code is proved to work better than native implementations of those features, so
Babel is used here with Webpack. Webpack is both used by the back-end applications to
generate transpiled bundles and by the front-end apps (admin and Vue app) to generate
uglified, compressed bundles. If you change any Javascript code in this project, you will
likely need to run one of the commands below. If you want to rebundle everything, don't
hesitate to run `npm run build`, it will take 10s average. The `gulp` tasks still need
to be run separately, though. It's highly recommended to run the `gulp` task BEFORE
the `webpack` tasks.

If you edit the css files (probably those on `public` folder) you will likely
need to run the `gulp` command in the project's root directory to rebuild the
css bundle.

If you edit the `views` folder (or anything that is imported by those files), you will
likely need to rebuild the `Vue` components to see the changes in local testing. 
This can be acomplished by running `npm run build-front` in the project's root directory.

If you edit the `public/js/admin` folder or anything that is imported by those files,
you will need to run `npm run build-admin` to see the changes in local testing.
This will rebuild the `ng-admin` scripts.

If you edit the `judge` folder or anything that is imported by those, you will likely
need to rebuild the judge bundle running `npm run build-judge` to see the changes
locally.

If you edit anything used in the express app (almost everything is :)), you will
likely need to run `npm run build-index` to see the changes locally. This will
rebundle the express app.

You can install these tools and make them globally available (as shown above)
by running `npm install -g gulp webpack`, or you can install them locally
as well.

## Host Installation [DEPRECATED FOR NOW]

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