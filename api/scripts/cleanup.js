const mongoose = require("mongoose");
const UserProfile = require("../models/userProfile")

// const MONGO_URI = "mongodb+srv://j412cff_db_user:L1BFVjhdTNMUrGSo@events.gwywfsl.mongodb.net/events"; 

async function cleanDatabase() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully!");

        // Wipes out items from the savedEvents array ONLY if they are strings
        const result = await UserProfile.updateMany(
            {},
            { $pull: { savedEvents: { $type: "string" } } }
        );

        console.log(`Clean up complete! Checked all profiles. Modified ${result.modifiedCount} documents.`);
    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

cleanDatabase();