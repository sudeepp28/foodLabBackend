
const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();
//  const { ObjectId } = require('mongodb');

router.get('/',async(req,resp)=>{
  console.log(req.userId)
  const db=await dbConnection();
  const collection=db.collection('saved restaurants');
  let data=await collection.find({userId:req.userId}).toArray()
  resp.send(data)
});

router.post('/',async(req,resp)=>{
 const db=await dbConnection();
  const collection=db.collection('saved restaurants')

const items=req.body

  const savingResturants={...items,userId:req.userId}
  let result=await collection.insertOne(savingResturants)
  resp.send(result)
})

// const { ObjectId } = require('mongodb');
router.delete('/:restaurantId', async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const userId = req.userId;

  console.log("userId from token:", userId);
  console.log("restaurantId from params:", restaurantId);

  const db = await dbConnection();
  const collection = db.collection('saved restaurants');

  // Fetch all saved docs


  if (!userId || !restaurantId) {
    return res.status(400).send({ message: 'Missing userId or restaurantId' });
  }

  try {
    const result = await collection.deleteOne({ userId, restaurantId });

    if (result.deletedCount === 1) {
      res.send({ message: 'Deleted successfully' });
    } else {
      res.status(404).send({ message: 'No matching record found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});



module.exports=router