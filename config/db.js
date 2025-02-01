const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const { createLogger, transports } = require("winston");

const logger = createLogger({
  transports: [new transports.Console]
});
  
async function connectDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    logger.info("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}

async function disconnectDB() {
  await mongoose.disconnect()
  logger.warn("disconnected from DB");
}

mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to DB');

    // set the devs as admins
    if(!process.env.DEV_IDS){
        return;
    }
    UserModel = require('../models/userMode');
    const devIds= process.env.DEV_IDS.split(' ');
    devIds.forEach((id) => {
        UserModel.findOne({ _id: id }).then((result) => {
            if(!result){
                const usermode = new UserModel({
                    _id: id,
                    authorized: true,
                    admin: true
                });
                usermode.save().then((result) => {
                    logger.debug(result);
                });
            }else{
                result.admin = true;
                result.authorized = true;
                result.save().then((result) => {});
            }
        });
    });
  });

function addOnDB(on, func) {
  mongoose.connection.on(on, func);
}

module.exports = {
  connectDB,
  disconnectDB,
  addOnDB
}