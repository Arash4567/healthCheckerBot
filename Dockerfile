FROM node:lts-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

CMD [ "node", "app.js" ]