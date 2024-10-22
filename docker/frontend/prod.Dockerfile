FROM node:20-alpine3.18

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh libc6-compat

COPY ./frontend /srv/app

WORKDIR /srv/app

RUN yarn --cwd /srv/app --frozen-lockfile
RUN yarn --cwd /srv/app run build

CMD yarn run start
