FROM node:21.4-alpine3.19 as build

COPY . /app/
WORKDIR /app

RUN export PUBLIC_BUILD_DATE=$(date -Iseconds) && \
    npm install && \
    npm audit && \
    npm run check || true && \
    npm run lint:check || true && \
    npm run format:check && \
    npm run build



FROM node:21.4-alpine3.19 as deps

COPY package.json package-lock.json /app/
WORKDIR /app

RUN NODE_ENV=production npm install --omit=dev



FROM node:21.4-alpine3.19

RUN apk add --no-cache curl

ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/build /app
COPY --from=deps --chown=0:0 /app/node_modules /app/node_modules
COPY --chown=0:0 package.json package-lock.json entrypoint.js /app/
COPY --chown=0:0 docs/config.yml /app/demo/config.yml

USER node
WORKDIR /app

EXPOSE 3000/tcp

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
 CMD [ "curl", "--fail", "--silent", "--output", "/dev/null", "--header", "Remote-User: healthcheck", "localhost:3000/healthcheck" ]

VOLUME /data

CMD ["node", "--unhandled-rejections=strict", "/app/entrypoint.js"]

