FROM node:18 as build

COPY . /app/

WORKDIR /app

RUN npm install && npm run build

FROM node:18-alpine

COPY --from=build --chown=0:0 /app/build /app
COPY --chown=0:0 entry.js package.json package-lock.json /app/

WORKDIR /app

# ignore-scripts to prevent install errors for trianglify
RUN npm install --omit=dev --ignore-scripts

EXPOSE 3000/tcp

CMD node --unhandled-rejections=strict /app/entry.js
