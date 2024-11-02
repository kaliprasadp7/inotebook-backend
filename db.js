const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017";

const connectToMongo = async () =>{
    try{
        await mongoose.connect(mongoURI, {});
        console.log('Database connected successfully');
    }catch(error){
        console.log("error while connecting to database",error);
    
    }
}
module.exports = connectToMongo;