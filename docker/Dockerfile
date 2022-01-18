FROM node:17-bullseye

RUN mkdir /code
WORKDIR /code

COPY ../code .

# RUN apk add --update --no-cache python2 make sqlite3 && ln -sf python3 /usr/bin/python

RUN yarn install
RUN yarn build

ENTRYPOINT [ "node", "build/index.js" ]