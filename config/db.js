const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
// console.log(uri);
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function connectDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
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
                    console.log(result);
                });
            }else{
                result.admin = true;
                result.authorized = true;
                result.save().then((result) => {});
            }
        });
    });
  });
module.exports = connectDB;