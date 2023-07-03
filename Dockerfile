FROM node:20 as build

COPY . /app/

WORKDIR /app

RUN npm install && npm run build


FROM node:20 as deps

COPY package.json package-lock.json /app/

WORKDIR /app

RUN NODE_ENV=production npm install


FROM node:20-alpine

RUN apk add --no-cache curl

ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/build /app
COPY --from=deps --chown=0:0 /app/node_modules /app/node_modules
COPY --chown=0:0 package.json package-lock.json entrypoint.js /app/
COPY --chown=0:0 particles/ /app/particles/
COPY --chown=0:0 docs/config.yml /app/demo/config.yml

USER node
WORKDIR /app

EXPOSE 3000/tcp

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
 CMD [ "curl", "--fail", "--silent", "--output", "/dev/null", "--header", "Remote-User: healthcheck", "localhost:3000/healthcheck" ]

VOLUME /data


CMD mkdir -p /data/logos && \
    ( [ -L /app/client/logos ] || ln -s /data/logos /app/client/logos ) && \
    mkdir -p /data/users/backgrounds && \
    ( [ -L /app/client/backgrounds ] || ln -s /data/users/backgrounds /app/client/backgrounds ) && \
    mkdir -p /data/users/config && \
    ( [ -f /app/client/backgrounds ] || touch /data/config.yml) && \
    node --unhandled-rejections=strict /app/entrypoint.js
