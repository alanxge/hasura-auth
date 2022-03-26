.PHONY: check build run up dev stop down ps log logs

SHELL=/bin/bash

IMAGE=hasura-auth:latest

check:
	@which docker  || echo  "Error: no docker command found!"
	@which docker-compose || echo  "Error: no docker-compose command found!"
	@[[ -r Dockerfile ]] && ls -l Dockerfile || echo  "Error: no Dockerfile file found!"
	@[[ -r docker-compose.yaml ]] && ls -l docker-compose.yaml || echo  "Error: no Dockerfile file found!"


build:
	docker build -t ${IMAGE} .


run:
	docker-compose up  -d

up: run


dev:    # don't daemonize 
	docker-compose up

ps:
	docker-compose ps


log:
	docker-compose logs -f 

logs: log
