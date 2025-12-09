# Use official Node.js image from Docker Hub
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json /app/

# Install the frontend dependencies
RUN npm install

# Copy the rest of the React app code
COPY . /app/

# Build the React app for production
RUN npm run build

# Expose port 3000 for the React app
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
