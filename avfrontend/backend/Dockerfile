# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy ONLY package files first (better Docker caching & avoids stale deps)
COPY package.json package-lock.json ./

# Install dependencies with a clean environment
RUN npm ci --only=production

# Copy the rest of the backend code AFTER installing deps
COPY . .

# Expose port your backend listens on
EXPOSE 3001

# Start the backend server
CMD ["node", "server.js"]
