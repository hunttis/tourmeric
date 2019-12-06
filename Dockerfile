FROM node:8-alpine

WORKDIR /usr/src/tourmeric

COPY package.json ./
RUN yarn
COPY . .
COPY src/__mocks__/config.js src/config.js
CMD yarn test; yarn lint; yarn check-translations

