FROM keymetrics/pm2:latest-alpine

WORKDIR /opt/arena

RUN groupadd -g 1001 arena
RUN useradd -r -u 1001 -g arena arena
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
