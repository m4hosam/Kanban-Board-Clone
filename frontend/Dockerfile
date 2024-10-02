# Use an official Node runtime as the base image
FROM node:20

# Define build arguments for environment variables
ARG VITE_API_URL


# Set environment variables during the build process
ENV VITE_API_URL=$VITE_API_URL


# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Install a simple http server for serving static content
RUN npm install -g serve

# The app binds to port 3000
EXPOSE 8080

# Run the app
CMD [ "npm", "run", "preview" ]