# Step 1: Use Node.js base image
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install app dependencies (npm ci installs from package-lock.json)
RUN npm ci --only=production

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the NestJS application (optional step if using build process)
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Command to run the application
CMD ["npm", "run", "start:prod"]