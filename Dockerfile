FROM node:16-slim AS builder

WORKDIR /app

COPY . .

RUN yarn install --immutable --immutable-cache
RUN yarn build

FROM node:16 AS final

WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY .yarn/ ./.yarn/
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
RUN yarn workspaces focus --all --production

CMD [ "yarn", "start" ]
