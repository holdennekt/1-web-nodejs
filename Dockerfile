FROM node:16.14.2

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm i typescript

COPY . /usr/src/app/

RUN npm run build

ENV PORT 3000
ENV HOST 0.0.0.0

EXPOSE 3000

CMD npm start
