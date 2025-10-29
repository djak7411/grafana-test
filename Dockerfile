FROM node:25

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/logs

EXPOSE 3001

CMD ["npm", "start"]