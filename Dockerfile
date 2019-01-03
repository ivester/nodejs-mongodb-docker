FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm i
COPY . /app
CMD node server.js
EXPOSE 4000
