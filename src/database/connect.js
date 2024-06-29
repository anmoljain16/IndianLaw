import mongoose from "mongoose";


const connection = {};

async function Connect() {
    if (connection.isConnected) {
        // console.log("Using existing connection");

        return;
    }

    try {
        // console.log("Using new connection");
        // console.log(process.env.MONGO_URI);

        const db = await mongoose.connect(process.env.MONGO_URI);

        //  console.log(db);


        connection.isConnected = db.connections[0].readyState;
        console.log(connection.isConnected);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);

    }
}

export default Connect;
