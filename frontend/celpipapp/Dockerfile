# Use official Node.js image from Docker Hub
FROM node:18-slim AS build

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


# Runtime stage 
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the React app
EXPOSE 80

# Start the React app
CMD ["nginx", "-g", "daemon off;"]
