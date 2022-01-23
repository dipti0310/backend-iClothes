const express=require("express");
// const res = require("express/lib/response");
const router=express.Router();
const {fetchuser,authRole} = require('../middleware/fetchuser');
const Cloth = require('../models/Cloth');
const { body, validationResult } = require('express-validator');
const { ROLE } = require('../data');
const User = require("../models/User");
const mongoose = require("mongoose");
const multer = require('multer');
const upload=multer({dest:'uploads/'})

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
//   fileFilter: fileFilter
// });


// ROUTE 1: Get All the Cloths using: GET "/api/auth/getuser". Login required
// console.log(ROLE);

router.get('/fetchallclothes', fetchuser, async (req, res) => {
    try {
        const clothes = await Cloth.find();
        console.log(req.user);
        res.json(clothes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Cloth using: POST "/api/auth/addcloth". Login required
router.post('/addcloth', upload.single('productImage'), fetchuser,authenticate,[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {

            const { title, description, size,color,price,quantity } = req.body;
    

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const cloth = new Cloth({
                title, description, size,color, price, user: req.user.id ,productImage: req.file.path ,quantity
            })
            const savedCloth = await cloth.save()

            res.json(savedCloth)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

    
// ROUTE 3: Update an existing Cloth using: POST "/api/cloths/updatecloth". Login required
router.put('/updatecloth/:id', fetchuser,  authenticate, async (req, res) => {
    const { title, description, size,color,price,quantity } = req.body;
    // Create a newCloth object
    const newCloth  = {};
    if(title){newCloth.title = title};
    if(description){newCloth.description = description};
    if(size){newCloth.size = size};
    if(color){newCloth.color = color};
    if(price){newCloth.price = price};
    if(quantity){newCloth.quantity=quantity};


    // Find the cloth to be updated and update it
    let cloth = await Cloth.findById(req.params.id);
    if(!cloth){return res.status(404).send("Not Found")}

    if(cloth.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    cloth = await Cloth.findByIdAndUpdate(req.params.id, {$set: newCloth}, {new:true})
    res.json({cloth});

    })

    // ROUTE 4: Delete an existing Cloth using: DELETE "/api/cloths/deletecloth". Login required
router.delete('/deletecloth/:id', fetchuser,  authenticate, async (req, res) => {
    try {
        // Find the cloth to be delete and delete it
        let cloth = await Cloth.findById(req.params.id);
        if (!cloth) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Cloth
        if (cloth.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        cloth = await Cloth.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Cloth has been deleted", cloth: cloth });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

async function authenticate (req, res, next) {
    const userId=req.user.id;
//    console.log(userId+"=================================");
    const user= await User.findById(userId).select("-password");
    // console.log(user);
    if (user.role!=ROLE.ADMIN) {
      res.status(401)
      return res.send('Not Allowed')
    }
  
    next()
  }


  
module.exports=router