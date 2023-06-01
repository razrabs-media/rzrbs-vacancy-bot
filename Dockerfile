FROM node:current-alpine3.17
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm config set strict-ssl false && \
    npm install && \
    npx husky install
CMD [ "npm","start" ]