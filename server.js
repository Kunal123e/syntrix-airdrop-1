require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors({

origin:"*",

methods:[
"GET",
"POST"
],

allowedHeaders:[
"Content-Type"
]

}));

app.use(express.json());

app.use(

rateLimit({

windowMs:
15*60*1000,

max:100

})

);

const supabase =
createClient(

process.env.SUPABASE_URL,

process.env.SUPABASE_SERVICE_ROLE

);

const TOKEN_ADDRESS =
process.env.TOKEN_ADDRESS;

app.get("/",(req,res)=>{

res.json({

status:"Running",

token:TOKEN_ADDRESS,

reward:10

});

});

app.post("/claim",

async(req,res)=>{

try{

console.log(

"Request Body:",

req.body

);

const {

wallet,
email

}=req.body;

if(

!wallet ||

wallet.trim()===""

){

return res
.status(400)
.json({

error:
"Wallet required"

});

}

const {

data:existing,

error:findError

}=

await supabase

.from("claims")

.select("*")

.eq(

"wallet",

wallet

);

if(findError){

console.log(

findError

);

throw findError;

}

if(

existing &&
existing.length>=1

){

return res
.status(400)
.json({

error:
"Already claimed"

});

}

const {

error

}=

await supabase

.from("claims")

.insert([{

wallet,

email,

amount:10,

created_at:
new Date()

}]);

if(error){

console.log(

"Insert Error",

error

);

throw error;

}

console.log(

"Inserted:",

wallet

);

res.json({

success:true,

reward:10,

message:
"Syntrix claim successful"

});

}

catch(err){

console.log(

"Backend Error:",

err

);

res
.status(500)
.json({

error:

err.message

});

}

}

);

const PORT=

process.env.PORT
||3000;

app.listen(

PORT,

()=>{

console.log(

`Running ${PORT}`

);

}

);
