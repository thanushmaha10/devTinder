# Use Node.js LTS (Express v5 works fine on this)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies (Express 5 included)
RUN npm install

# Copy application source
COPY . .

# Expose the port your server uses
EXPOSE 7777

# Start the app
CMD ["node", "server.js"]
