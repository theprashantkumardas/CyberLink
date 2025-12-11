const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('>> SYSTEM: DATALINK ESTABLISHED (MongoDB)');
  } catch (err) {
    console.error('>> SYSTEM: DATALINK FAILURE', err);
    process.exit(1);
  }
};

module.exports = connectDB;