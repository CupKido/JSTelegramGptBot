# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
# This layer is only re-built when package.json changes
COPY package*.json ./

# Install your app dependencies using the npm binary
RUN npm install --production

# Bundle your app source inside the Docker image
COPY . .

# The application's port, e.g., 3000 for a web server
# Remember to expose the port your application runs on
EXPOSE 3000

# Define environment variables if necessary
# ENV NODE_ENV=production
# ENV TELEGRAM_TOKEN=your_telegram_bot_token
# ENV MONGO_URI=mongodb://your_mongodb_uri
# ENV OTHER_ENV=your_other_environment_variables

# Run the app command (e.g., "node", "npm start", "node your-app.js", etc.)
CMD ["node", "index.js"]