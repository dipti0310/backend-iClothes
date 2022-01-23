const connectToMongo =require("./db");
const express = require('express')
var cors = require('cors') 
const bodyParser = require("body-parser");


const app = express()
const port = 5000

app.use(cors())
app.use(express.json())


connectToMongo();

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


// Available routes
app.use("/api/auth",require("./routes/auth"))
app.use("/api/clothes",require("./routes/clothes"))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})