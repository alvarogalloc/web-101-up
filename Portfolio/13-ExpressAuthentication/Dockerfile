# should be a super simple image alpine
# i just want this to run everywhereee
FROM node:18-alpine
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]
