const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const DB = "db.json";

/* READ DB */
function readDB(){
  return JSON.parse(fs.readFileSync(DB));
}

/* WRITE DB */
function writeDB(data){
  fs.writeFileSync(DB, JSON.stringify(data,null,2));
}

/* ORDER */
app.post("/order",(req,res)=>{
  let data = readDB();

  let order = {
    id: data.length + 1,
    email: req.body.email,
    layanan: req.body.layanan,
    harga: req.body.harga,
    status: "Pending",
    tanggal: new Date().toLocaleString()
  };

  data.push(order);
  writeDB(data);

  res.json({msg:"ok"});
});

/* GET */
app.get("/orders",(req,res)=>{
  res.json(readDB());
});

/* UPDATE */
app.post("/update",(req,res)=>{
  let {id,status} = req.body;
  let data = readDB();

  data.forEach(o=>{
    if(o.id === id){
      o.status = status;
    }
  });

  writeDB(data);
  res.json({msg:"updated"});
});

/* ADMIN */
app.use("/admin", express.static("admin"));

app.listen(3000,()=>console.log("http://localhost:3000"));
