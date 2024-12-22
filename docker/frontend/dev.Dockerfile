FROM node:20-alpine3.18

ARG LINUX_USER_ID

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh libc6-compat

RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Clean up unnecessary files
RUN rm -rf /var/cache/apk/* /tmp/*

RUN if [[ $LINUX_USER_ID == 1000 ]]; then \
  deluser node; \
fi

RUN addgroup --gid $LINUX_USER_ID docker \
    && adduser --uid $LINUX_USER_ID --ingroup docker --home /home/docker --shell /bin/sh --disabled-password --gecos "" docker

USER $LINUX_USER_ID

WORKDIR /srv/app
