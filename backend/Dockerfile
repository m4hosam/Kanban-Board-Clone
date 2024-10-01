# Use an official Node runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# # Copy prisma schema
# COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate


# # Build TypeScript code
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
# CMD ["node", "dist/app.js"]
CMD ["sh", "-c", "npx prisma db push && npm start"]