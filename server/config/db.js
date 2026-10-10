const mongoose = require("mongoose");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "❌ MONGO_URI is not set. Check your server/.env file."
    );
    process.exit(1);
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`MongoDB connection attempt ${attempt}/5...`);

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 20000,
      });

      console.log(
        `✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`
      );

      return;
    } catch (err) {
      console.error(
        `❌ Connection attempt ${attempt} failed:`,
        err.message
      );

      await mongoose.disconnect().catch(() => {});

      if (attempt < 5) {
        console.log("Retrying in 3 seconds...");
        await sleep(3000);
      } else {
        console.error(
          "MongoDB connection failed after 5 attempts. Check your network and Atlas connectivity."
        );
        process.exit(1);
      }
    }
  }
}

module.exports = connectDB;