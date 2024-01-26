import express  from "express";
const app = express();
import dotenv from "dotenv";

// require('.dotenv').config();
dotenv.config();

const port = process.env.PORT || 1000;

app.listen(port, ()=>{
      console.log('Connection is made')
})