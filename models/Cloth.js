const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClothesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
   title:{
       type:String,
       require:true
   },
   description:{
    type:String,
    require:true,
},
size:{
    type:String,
},
color:{
    type:"String"
},
price:{
    type:Number,required:true
},
productImage: { type: String, required: true },
date:{
    type:Date,
    default:Date.now
},
quantity:{
    type:Number,required:true
}
  });

  module.exports=mongoose.model("cloth",ClothesSchema);