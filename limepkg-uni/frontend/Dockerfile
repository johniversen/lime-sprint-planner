FROM 204506327171.dkr.ecr.eu-west-1.amazonaws.com/lundalogik/crm/node-base:latest
WORKDIR /lime
COPY --chown=limeuser:limeuser package*.json /lime/
RUN npm install
COPY --chown=limeuser:limeuser . /lime
RUN npm run build