FROM node:18 as build

COPY . /app/

WORKDIR /app

RUN npm install && npm run build

FROM node:18-alpine

COPY --from=build --chown=0:0 /app/build /app

COPY package.json package-lock.json /app/

WORKDIR /app

RUN npm install --omit=dev

EXPOSE 3000/tcp

CMD node --unhandled-rejections=strict /app/index.js
