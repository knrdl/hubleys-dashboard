FROM node:18 as build

COPY . /app/

WORKDIR /app

RUN npm install && npm run build


FROM node:18 as deps

COPY package.json package-lock.json /app/

WORKDIR /app

RUN npm install --omit=dev --ignore-scripts


FROM node:18-alpine

COPY --from=build --chown=0:0 /app/build /app
COPY --from=deps --chown=0:0 /app/node_modules /app/node_modules
COPY --chown=0:0 entrypoint.js /app/
COPY --chown=0:0 particles/ /app/particles/

WORKDIR /app

EXPOSE 3000/tcp

CMD node --unhandled-rejections=strict /app/entrypoint.js
