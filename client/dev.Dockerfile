FROM node:8.10-alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm i

CMD ["npm", "start"]
