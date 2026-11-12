
# Use a stable Node.js LTS environment.
FROM node:24-bookworm-slim

WORKDIR /app

# Install OpenSSL required by Prisma.
RUN apt-get update && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies.
COPY package*.json ./
RUN npm ci

# Copy backend source files.
COPY . .

# Temporary database URL for Prisma Client generation.
# The real database URL is provided by Docker Compose.
ENV DATABASE_URL="file:/data/dev.db"

# Generate Prisma Client and compile NestJS.
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Apply migrations before starting the backend.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
