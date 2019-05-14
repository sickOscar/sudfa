# Stage 1 - the build process
FROM node:8.10-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i --production
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

COPY ./config/default.conf /etc/nginx/conf.d/
# RUN cat /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
