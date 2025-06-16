const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();
 const { ObjectId } = require('mongodb');

router.get('/',async(req,resp)=>{
   const db=await dbConnection();
    const collection= db.collection('cart');
    const data=await collection.find({userId:req.userId}).toArray();
resp.send(data)
});
router.post('/',async (req,resp)=>{
  const {restaurantName,restaurantId, name, price, imgUrl, quantity,address,rating,Quantity }=req.body

    let db= await dbConnection();
    let collection=db.collection('cart')
    let result= await collection.insertOne({userId:req.userId,restaurantName,restaurantId, name, price, imgUrl, quantity,address,rating,Quantity})
    resp.send(result)
})
router.put('/:id',async (req, resp) => {
  try {
    let db = await dbConnection();
    let collection = db.collection('cart');

    // Validate ID format before using ObjectId
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({ message: 'Invalid ID format' });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id), userId:req.userId },
      { $set: req.body }
    );

    if (result.modifiedCount === 0) {
      return resp.status(404).send({ message: 'Item not found or no change made' });
    }

    resp.send(result);
  } catch (error) {
    console.error('Error in PUT /cart/:id ->', error);
    resp.status(500).send({ message: 'Internal server error', error });
  }
});

router.delete('/delete',async(req,resp)=>{

    
    let db= await dbConnection();
    let collection=db.collection('cart')
    let result=await collection.deleteMany({userId:req.userId});
    resp.send(result)
})
router.delete('/:_id',async(req,resp)=>{

   console.log(req.params)
    let db= await dbConnection();
    let collection=db.collection('cart')
    let result=await collection.deleteOne({_id:new ObjectId(req.params._id),userId:req.userId});
    resp.send(result)
})
module.exports=router