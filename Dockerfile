# -----------------------------
# STEP 1: Build React App
# -----------------------------
FROM node:18-alpine AS builder

# Create working directory
WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install exact dependencies from lockfile
RUN npm ci

# Copy all source code
COPY . .

# Build production files
RUN npm run build


# -----------------------------
# STEP 2: Serve using Nginx
# -----------------------------
FROM nginx:alpine

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
