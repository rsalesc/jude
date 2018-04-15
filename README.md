## Development

This documentation is purely intended to be used by developers.
There is still no official documentation on how to install and
configure Jude for use.

### Step zero

Go to Google and make sure you can get Docker and Node 8+ running, please. The `install_node.sh` is a cool way of getting Node 8 installed if you are lazy.

### First step to start developing

Clone the project, go to its root and run `npm install` to make sure
all the dependencies (prod and dev ones) are correctly installed. Also make
sure you get global `webpack` and `gulp` installations by running `sudo npm install -g webpack gulp`.

### VSCode

Using VSCode here is highly encouraged. You should get at least the following extensions: `ESLint`, `Vetur` and `Mocha sidebar`. If you are unable to use VSCode, try at least to get a similar functionality from your current text editor/IDE to avoid submitting bad or untested code.

### Codemap

- App: files `app.js` and `index.js`
  - There are all the definitions needed to initiate the webservice.
- DB: file `db.js`
  - All the definitions to access the MongoDB database via Mongoose are here. You will notice that this is exposed globally and this file is required in basically every file that needs database access (almost every back-end module).
- Models: folder `models`
  - Those are all the Mongoose models defined in the project. You can google more about mongoose, it is just a nice way of defining schemas and adding behavior to MongoDB documents (which if you don't know and like JS, you should definitely google about).
- Auth2: file `auth2.js`
  - It is the file responsible for handling auth. It's a middleware (it is like an interceptor for Express) which checks if user has the permissions (role) to do the request, process login requests, logout requests and all that stuff. I'm planning to move this to an external module eventually, or make it wrap a well maintained module that does something similar.
- Judge: folder `judge`
  - This is the component responsible for judging the solutions of the contestants. It also exposes some modules to the other components.
- Webservice/API: folder `routes`
  - This is the component responsible for processing the requests of the clients, like submitting, retrieving contest info (or not retrieving them if the user has no permission).
  - You will notice that there are functions which are not in there. That's because we use `express-mongoose-restify` to expose trivial functionalities like GET, POST, DELETE, etc. for each of the models defined in `mongoose`. Of course, those functionalities are only available for admins. Normal users will always do requests which are defined in the `routes` folder.
  - You will notice as well that there is probably only one or two non-API kinds of request, which renders the page the user see. That's because the front-end app is actually a single-page application.
- Front-end app: folder `src/bulma`
  - It is a single-page application built on top of VueJS, a nice framework like AngularJS and React (way more like AngularJS). It also uses Bulma and Buefy. Bulma is just a CSS framework, and Buefy is a VueJS integration with Bulma: it exposes components with logic leveraging Bulma cool-looking design. All the components in SPA are there, and of course, there are some external imports, like for `judge/scoring.js`. Here is where all the processing comes in. The standings are actually generated on client-side, not on server-side, and the score is defined here is a well. Well, if a client change his own score in his own computer, how does it matter? The main goal is to leave more computational resources available to the judge.
  - If you want to contribute here, you should start reading about VueJS. It is a long way.
- Admin panel: `public/js/admin`
  - The admin panel, built on AngularJS + ng-admin library and likely to change. Not too much on this, avoid touching it. Seriously.

#### Some other interesting things

- `seaweedfs`: It's a module used by Jude to expose a cool distributed filesystem to make sure that, when needed, we can easily change it all to be distributed and highly available (for instance, when holding Brazilian sub-regionals? (: )
- `eslint`: ESLint is used everywhere to make sure that code is compliant with some style and good practices constraints. Notice that there is some old code that is not compliant with it. If you touch such code, make sure you make it compliant with `eslint`, and when writing new code, please run it with `./node_modules/.bin/eslint [your_file]`, where `[your_file]` is your JS file or some glob pattern. If you use VSCode, install the ESlint extension.
- Root imports: There are some aliases defined so you can import your code from the root of the project. This is a long-term encouraged practice although we don't use it extensively yet. Ex: `import "../../../src/bulma/index.js"` can be replaced by `import "@front/index.js"`. You can check all the defined aliases (and define your own if it makes sense) in `.babelrc`. ESLint will handle those cool looking imports gracefully, but other tools may not, so avoid using them (for example, in your own cool IDE).

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

#### Lifting up a dev instance of Jude

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

## Host Installation [DEPRECATED FOR NOW, PLEASE USE DOCKER]

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
