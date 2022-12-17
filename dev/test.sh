#!/bin/bash

podman network create hubleys_net

podman run -dit --rm -p8000:8000 --name hubleys_proxy --net hubleys_net -v "$PWD/Caddyfile.test:/etc/caddy/Caddyfile:ro" docker.io/caddy:alpine

podman build -t hubleys-test ..

echo http://localhost:8000/

mkdir -p ./userdata
podman run -it --rm --name hubleys_app --net hubleys_net --env-file ./secrets \
  -v "$PWD/userdata:/userdata" -v "$PWD/config.yml:/app/config.yml:ro" hubleys-test

podman stop hubleys_proxy
podman network rm hubleys_net
