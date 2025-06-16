const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();
// const dbConnection=require('./mongoDb.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.get('/',async(req,resp)=>{
   const db=await dbConnection();
    const collection= db.collection('restaurants');
    const data=await collection.find().toArray();
resp.send(data)
});

router.put('/:id', async (req, resp) => {
  try {
    let db = await dbConnection();
    let collection = db.collection('restaurants');

    // Validate ID format before using ObjectId
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({ message: 'Invalid ID format' });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
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


module.exports=router