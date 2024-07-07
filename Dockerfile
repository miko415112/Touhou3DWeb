FROM node:16-alpine
EXPOSE ${PORT}
COPY . /app
WORKDIR /app
RUN corepack enable
RUN npm install
RUN npm run build

CMD ["npm", "run", "deploy"]
