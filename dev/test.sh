#!/bin/bash

podman network create hubleys_test_net

podman run -dit --rm -p8001:8000 --name hubleys_test_proxy --net hubleys_test_net -v "$PWD/Caddyfile.test:/etc/caddy/Caddyfile:ro" docker.io/caddy:alpine

podman build -t hubleys-test ..

echo http://localhost:8001/

mkdir -p ./userdata
podman run -it --rm --name hubleys_test_app --net hubleys_test_net --env-file ./secrets hubleys-test

podman stop hubleys_test_proxy
podman network rm hubleys_test_net
