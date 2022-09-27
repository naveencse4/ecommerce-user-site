1. clone the code
2. After cloning the move to root folder of the code and open terminal
3. install required modules with `npm install`
4. Create a duplicate file from env_template.js.
5. Rename the duplicate file as env.js and save it.
6. Change the API_URL value to environment specific.
    DEV:    HTTP://APIDEV.HEYBANDI.COM:3000/API
    STG:    HTTP://APISTG.HEYBANDI.COM:3000/API
    PROD:   HTTP://API.HEYBANDI.COM:3000/API

7. `npm run dev` to start development server
8. `npm build` to create production build files
9. `npm start` to run prod server
