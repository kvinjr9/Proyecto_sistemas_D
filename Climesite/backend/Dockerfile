FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# copy package files and install all deps (including dev) for build
COPY package*.json ./
RUN npm install

# copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# copy only production deps
COPY package*.json ./
RUN npm install --production

# copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
