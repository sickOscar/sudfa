FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY package.json .
COPY ecosystem.config.js .
COPY server.js .
COPY /home/ubuntu/.env .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN node -v

# Expose the listening port of your app
EXPOSE 5000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
