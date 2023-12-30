FROM node:21.5-alpine3.19 as build

COPY . /app/
WORKDIR /app

ARG PUBLIC_VERSION
RUN PUBLIC_BUILD_DATE="$(date -Iseconds)" && \
    export PUBLIC_BUILD_DATE && \
    npm install && \
    npm audit && \
    yarn licenses generate-disclaimer > static/3rdpartylicenses.txt && \
    npm run check && \
    npm run lint:check && \
    npm run format:check && \
    npm run build



FROM node:21.5-alpine3.19 as deps

COPY package.json package-lock.json .npmrc /app/
WORKDIR /app

RUN NODE_ENV=production npm install --omit=dev



FROM node:21.5-alpine3.19

RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV NODE_OPTIONS="$NODE_OPTIONS --unhandled-rejections=strict"

COPY --from=build --chown=node:node /app/build /app
COPY --from=deps --chown=0:0 /app/node_modules /app/node_modules
COPY --chown=0:0 package.json package-lock.json entrypoint.js .npmrc /app/

USER node
WORKDIR /app

EXPOSE 3000/tcp

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD [ "curl", "--fail", "--silent", "--output", "/dev/null", "--header", "$HTTP_HEADER_USERID: healthcheck", "localhost:3000/healthcheck" ]

VOLUME /data

CMD ["node", "/app/entrypoint.js"]

# Headers set by the reverse proxy
ENV HTTP_HEADER_USERID="Remote-User"
ENV HTTP_HEADER_USERNAME="Remote-Name"
ENV HTTP_HEADER_EMAIL="Remote-Email"
ENV HTTP_HEADER_GROUPS="Remote-Groups"

# timeout for requests from server to third party apis, in millisecs
ENV SERVER_REQUEST_FAILFAST_TIMEOUT="750"
ENV SERVER_REQUEST_MAX_TIMEOUT="15000"

# cache lifetime for requests from server to third party apis, in minutes
ENV SERVER_REQUEST_CACHE_TTL="10"

ENV LOG_LEVEL="info"
