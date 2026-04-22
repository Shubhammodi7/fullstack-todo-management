const mongoose = require('mongoose');


const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected");
  } catch (error) {
    console.log("Failed to connect to DB");
  }
}

module.exports = connectToDb