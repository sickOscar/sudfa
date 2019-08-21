FROM node:alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm i

COPY ./ecosystem.config.js ./

CMD ["npm", "run", "dev"]
