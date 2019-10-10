FROM debian:stretch

WORKDIR /app

RUN apt-get update

RUN apt-get install -y curl software-properties-common
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN node -v
RUN npm -v

RUN apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb
ENV DISPLAY ":20"

ENV DEBUG=*

CMD Xvfb $DISPLAY -screen 0 1366x768x16 & tail -f /dev/null
