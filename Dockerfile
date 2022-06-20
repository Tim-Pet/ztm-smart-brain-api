FROM node:latest

WORKDIR /usr/src/ztm-smart-brain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]

