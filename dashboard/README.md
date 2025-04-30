# Dashboard Frontend Setup


### Compile and Run the Dashboard

Follow these steps to set up and run the dashboard frontend locally:

```
cd dashboard          # Go to the dashboard project folder
nvm use 22            # Use Node.js version 22 (make sure it's installed)
yarn preinstall       # Run any setup needed before installing packages
yarn install          # Install project dependencies
yarn run dev          # Start the development server (Vite + React) on port 5173
```
### Additional Notes:
- Before compiling, make sure to remove the node_modules folder to avoid conflicts:
    ```
    rm -rf node_modules
    ```
- Make sure you have Node Version Manager (nvm) installed.
- You need Yarn installed globally ```npm install -g yarn``` if it's not already.
- The dashboard runs by default on http://localhost:5173.
- If port 5173 is in use, Vite will suggest a different port.
- This setup is for development. For production builds, use `yarn build`.