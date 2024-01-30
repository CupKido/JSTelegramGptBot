# Use an official Node runtime as a parent image
 FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the container's port (assuming your Express server listens on port 3000)
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]