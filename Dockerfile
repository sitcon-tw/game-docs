FROM oven/bun:1 AS install

WORKDIR /app

ENV ASTRO_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM install AS build

COPY . .
RUN bun run build

FROM oven/bun:1 AS production-deps

WORKDIR /app

ENV ASTRO_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM node:22-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=4321 \
	ASTRO_TELEMETRY_DISABLED=1

COPY --from=production-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

USER node

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
