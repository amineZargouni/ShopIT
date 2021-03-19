const app = require('./app');
const connectDatabase = require('./config/database');
const dotenv = require('dotenv');

//handle the Uncought exceptions
process.on('uncaughtException',err =>{
    console.log(`ERROR : ${err.stack}`);
    console.log(`Shutting down due to uncaught exceptions`);
    process.exit(1);
})

//setting up config file
dotenv.config({ path: 'backend/config/config.env' })

//connect to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT :
     ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});


//handle unhandled Promise rejection bad link of mongo in config
process.on('unhandledRejection', err => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to the Unhandled Promise rejection`);
    server.close(() => {
        process.exit(1);
    })
})

