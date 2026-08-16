FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for efficient caching
COPY package*.json ./
RUN npm install

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
