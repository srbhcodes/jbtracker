const mongoose = require("mongoose");
const { seedIfEmpty } = require("../seedDummyJob");

const connectDb = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/job-portal";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
    await seedIfEmpty();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
