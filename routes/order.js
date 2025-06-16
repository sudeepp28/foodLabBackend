
const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();

router.get('/', async(req,resp)=>{
  let db=await dbConnection();
  let collection=db.collection('orders');
  let data=await collection.find({userId:req.userId}).toArray()
  resp.send(data)
})

router.post('/',async(req,resp)=>{
const {items,total,placeAt}=req.body

  let db=await dbConnection()
  let collection=db.collection('orders');
  let result= await collection.insertOne({userId:req.userId,
    items,total,placeAt
  })
  resp.send(result)
})

module.exports=router