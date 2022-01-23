const mongoose =require('mongoose');

const mongoURI="mongodb+srv://dipti0310:"+process.env.PASSWORD+"@cluster0.r7iiy.mongodb.net/iClothes"

const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongodb server");
    })
}
module.exports=connectToMongo;