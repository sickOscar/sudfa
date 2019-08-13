FROM keymetrics/pm2:latest-alpine


WORKDIR /opt/runner

RUN addgroup -g 1001 -S runner
RUN adduser -h /opt/runner -u 1001 -D -G runner runner
USER runner

# Bundle APP files
COPY src src/
COPY package.json .
COPY ecosystem.config.js .
COPY server.js .
COPY .env .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN node -v

# Expose the listening port of your app
EXPOSE 5000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
