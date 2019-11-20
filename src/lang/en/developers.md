# Developers information

Do you want to help with making Chorus even better? Find help below...

This page contains information about getting your dev environment up and running so you can build and test your
changes without the hassle of setting up all the required dependencies.

## Docker dev environment

Included in this repo is a `Dockerfile` which builds the Chorus 2 dev environment image. If you wanted to develop
_without_ using docker, this is a good reference as to what you need installed on your pc.

If you want to make your live much easier, just install docker then grab the pre-built image from docker hub.

```
docker pull jez500/chorus2-dev:latest
```

### Installing dev dependencies

Once you have the docker dev image, you can use this to do all your development related tasks. The first of these should
be installing all the nodejs/ruby dependencies.

```
docker run -tiP -v `pwd`:/app jez500/chorus2-dev:latest ./build.sh install
```

This will run `npm install` and `bundle install` inside the dev container.

You should only need to do this once, unless... `package.json` or `Gemfile` are updated

### Building/Compiling the project

If you have made changes to some coffee script or sass, you can build those changes via executing commands inside
the dev container. To get a command line in the container:

```
docker run -tiP -v `pwd`:/app jez500/chorus2-dev:latest bash
```

Once inside the dev container, you can do the following:

#### Build

This will build languages, documentation, js and css.

```
grunt build
```

#### Watch for changes (continuously build)

This will only build js and css.

```
grunt
```

## Committing your changes

As a rule of thumb, you should not commit any compiled files unless you are building a release. Eg. only commit files
in the `src` folder.
