FROM node:26.5.1-alpine3.24 AS build

COPY . /app/
WORKDIR /app

ARG PUBLIC_VERSION
RUN PUBLIC_BUILD_DATE="$(date -Iseconds)" && \
    export PUBLIC_BUILD_DATE && \
    npm install && \
    NODE_ENV=development npm run check && \
    npm run lint:check && \
    npm run format:check && \
    NODE_ENV=production npm run build



FROM node:26.5.1-alpine3.24 AS deps

COPY package.json package-lock.json .npmrc /app/
WORKDIR /app

RUN NODE_ENV=production npm install --omit=dev



FROM node:26.5.1-alpine3.24

RUN apk update --no-cache && \
    apk add --no-cache curl
ENV NODE_ENV=production
ARG NODE_OPTIONS=""
ENV NODE_OPTIONS="$NODE_OPTIONS --unhandled-rejections=strict"

COPY --from=build --chown=1000:1000 /app/build /app
COPY --from=deps --chown=0:0 /app/node_modules /app/node_modules
COPY --chown=0:0 package.json package-lock.json entrypoint.js .npmrc /app/

VOLUME /data
RUN mkdir -p /data && \
    chown -R 1000:1000 /data

USER 1000
WORKDIR /app

EXPOSE 3000/tcp

# hadolint ignore=DL3025
HEALTHCHECK --interval=30s --timeout=1s --retries=2 \
    CMD curl --fail --silent --output /dev/null --header "$HTTP_HEADER_USERID: healthcheck" "http://localhost:3000/healthcheck"

CMD ["node", "/app/entrypoint.js"]







# one of debug, info, warn, error
ENV LOG_LEVEL="info"

# paths for app & user config
ENV APP_CONFIG_FILE="/data/config.yml"
ENV FAVICON_FILE="/data/favicon.png"
ENV USERS_DIR="/data/users"
ENV LOGOS_DIR="/data/logos"
ENV WALLPAPER_DIR="/data/wallpaper"
# max size in MB of user uploaded background images
ENV BACKGROUND_IMG_MAX_UPLOAD_MB="10"

# userinfo headers set by the reverse proxy
ENV HTTP_HEADER_USERID="Remote-User"
ENV HTTP_HEADER_USERNAME="Remote-Name"
ENV HTTP_HEADER_EMAIL="Remote-Email"
ENV HTTP_HEADER_GROUPS="Remote-Groups"
# per default groups are split by one of ,;:|
ENV HTTP_HEADER_GROUPS_SEPARATOR=""

# timeout for requests from server to third party apis, in millisecs
ENV SERVER_REQUEST_FAILFAST_TIMEOUT="750"
ENV SERVER_REQUEST_MAX_TIMEOUT="15000"

# cache lifetime for requests from server to third party apis, in minutes
ENV SERVER_REQUEST_CACHE_TTL="10"

# Single User Mode disables web proxy authentication and ignores all HTTP_HEADER_* userinfo
ENV SINGLE_USER_MODE="false"
