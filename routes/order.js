
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
const {items,total,placeAt,bill}=req.body

  let db=await dbConnection()
  let collection=db.collection('orders');
  let result= await collection.insertOne({userId:req.userId,
    items,total,
    placeAt:placeAt || new Date().toISOString()
    ,bill
  })
  resp.send(result)
})
router.delete('/delete/:id', async(req,res)=>{
  
  let db=await dbConnection();
  let collection=db.collection('orders');
  let result=await collection.deleteOne({_id:new ObjectId(req.params.id)})
  res.send(result);
  
})

module.exports=router