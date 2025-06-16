const { MongoClient } = require('mongodb');

// const url = 'mongodb://localhost:27017';
const url="mongodb+srv://sudeeppalai:IztDxuvX4DwRPLdT@foolab.sjwrvjy.mongodb.net/"
const client = new MongoClient(url);

const dbConnection = async () => {
    try {
        let result = await client.connect();
        console.log("✅ MongoDB connected successfully.");
        return result.db('sFoody'); // your database name
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
    }
};

module.exports = dbConnection;


