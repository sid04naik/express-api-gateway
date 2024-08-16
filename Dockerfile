FROM node:20.14.0-alpine
WORKDIR /usr/src/app

RUN npm install -g nodemon

EXPOSE 8002

CMD ["nodemon", "index.js"]
