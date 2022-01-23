const mongoose =require('mongoose');

const mongoURI="mongodb+srv://dipti0310:dipti0310@cluster0.r7iiy.mongodb.net/iClothes"

const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongodb server");
    })
}
module.exports=connectToMongo;