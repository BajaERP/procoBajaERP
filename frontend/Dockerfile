FROM node:22-alpine AS base

WORKDIR /app

RUN mkdir -p /app/node_modules && chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./

FROM base AS dependencies

RUN npm ci

FROM base AS development

COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

COPY --chown=node:node . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS production-build

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY --from=production-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
