FROM node:20

WORKDIR /app

COPY packge.json /app/

RUN npm install

COPY . .a

EXPOSE 3000

CMD ["npm", "start"]