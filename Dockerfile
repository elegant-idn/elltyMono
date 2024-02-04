FROM public.ecr.aws/docker/library/node:18.7.0-alpine as BASE

ENV BASE_PACKAGES="git openssl less libcurl curl python3"\
    BUILD_PACKAGES="bash curl-dev build-base"

RUN apk update &&\
    apk upgrade &&\
    apk add --update --no-cache\
    $BASE_PACKAGES\
    $BUILD_PACKAGES

RUN npm install -g npm@8.17.0

ARG APP_ENV=production
ENV APP_ENV ${APP_ENV}

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN npm install

ADD . .

RUN npm run build

CMD ["npm", "run", "start"]
