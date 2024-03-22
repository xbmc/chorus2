FROM debian:stretch

# Location to mount app.
RUN mkdir /app
WORKDIR /app

# Install deps.
RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i s/security.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i s/stretch-updates/stretch/g /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends \
      # Git
      git \
      # Tools
      bzip2 libbz2-dev zip unzip \
      curl wget nano less \
      # Ruby deps
      ruby-full \
      software-properties-common gcc \
      libffi-dev libtool make gnupg \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install node.
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update && apt-get install -y --no-install-recommends \
      nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install bundler.
RUN gem install bundler -v 2.3.27 && bundle config path vendor/bundle

# Install grunt globally.
RUN npm install --global grunt
