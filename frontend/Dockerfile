FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for efficient caching
COPY package*.json ./
RUN npm install --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

# Copy application source
COPY . .

# Environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
