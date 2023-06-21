FROM node:current-alpine3.17
WORKDIR /usr/app
COPY ./ /usr/app
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    apk add --no-cache python3 py3-pip && \
    export NODE_TLS_REJECT_UNAUTHORIZED=0 && \
    npm config set strict-ssl false && \
    npm install && \
    npx husky install
CMD [ "npm","start" ]