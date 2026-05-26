require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Config
const PRIVATE_KEY =
process.env.PRIVATE_KEY;

const TOKEN_ADDRESS =
process.env.TOKEN_ADDRESS;

// Health Check
app.get("/", (req,res)=>{

res.json({

status:"Running",

token:TOKEN_ADDRESS,

reward:10

});

});

// Claim Endpoint
app.post("/claim",async(req,res)=>{

try{

const {

wallet,
email

}=req.body;

if(!wallet){

return res
.status(400)
.json({

error:
"Wallet required"

});

}

// 1 wallet = 1 claim

const existing =
await supabase
.from("claims")
.select("*")
.eq("wallet",wallet);

if(

existing.data &&
existing.data.length >= 1

){

return res
.status(400)
.json({

error:
"Already claimed"

});

}

// Save claim

const { error } =
await supabase
.from("claims")
.insert([{

wallet,

email,

amount:10,

created_at:
new Date()

}]);

if(error)
throw error;

// Future token transfer here

res.json({

success:true,

reward:10,

message:
"Syntrix claim successful"

});

}

catch(err){

console.error(err);

res
.status(500)
.json({

error:
err.message

});

}

});

const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log(

`Syntrix backend running ${PORT}`

);

});