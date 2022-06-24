import mongoose from "mongoose";

const { MONGO_URI } = process.env;

export function connect () {
    // Connecting to the database
    mongoose
        .connect(MONGO_URI,
            err => {
                if (err) throw err;
                console.log('connected to MongoDB')
            })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};



