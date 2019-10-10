FROM goforbroke1006/nodejs-xvfb

COPY . /app/
RUN npm install
RUN npm run build

ENV DISPLAY ":20"

ENV DEBUG=nightmare

CMD Xvfb $DISPLAY -screen 0 1366x768x16 & node dist/command/oanda/index.js
