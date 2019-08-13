FROM keymetrics/pm2:latest-alpine

WORKDIR /opt/arena

RUN addgroup -g 1001 -S arena
RUN adduser -h /opt/arena -u 1001 -G arena arena
USER arena

# Bundle APP files
COPY src src/
COPY package.json .
COPY ecosystem.config.js .
COPY index.js .
COPY .env .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN node -v

# Expose the listening port of your app
EXPOSE 5000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
