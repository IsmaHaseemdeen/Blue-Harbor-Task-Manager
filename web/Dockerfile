
# Use Node.js LTS for Next.js.
FROM node:24-bookworm-slim

WORKDIR /app

# Install frontend dependencies.
COPY package*.json ./
RUN npm ci

# Copy the frontend source files.
COPY . .

# The browser connects to the API through localhost.
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application.
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

# Make Next.js accessible outside the container.
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
