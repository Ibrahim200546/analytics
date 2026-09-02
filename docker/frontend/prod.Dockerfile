FROM node:20-alpine3.18

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh libc6-compat

COPY ./frontend /srv/app

WORKDIR /srv/app

ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_API_URL_FROM_SERVER=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL_FROM_SERVER=$NEXT_PUBLIC_API_URL_FROM_SERVER

RUN yarn --cwd /srv/app --frozen-lockfile
RUN yarn --cwd /srv/app run build

RUN chown -R node:node /srv/app
USER node

CMD yarn run start
