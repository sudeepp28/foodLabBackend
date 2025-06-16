
const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();

const cloudinary=require('cloudinary').v2
const { ObjectId } = require('mongodb');


cloudinary.config({
  cloud_name: 'dfnzuecxf',
  api_key: '177466569472887',
  api_secret: 'oMXaFqRqR9hcOiSBtr-HJ4fgvsA'
});

// Upload image route
router.post('/upload', async (req, res) => {
  const {userId,name,email}=req.body
  try {
    console.log("req.file=", req.files)
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const file = req.files.image;
    console.log(file)

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'users' // Optional
    });

    const profiledata={
  
      name,
      email,
      url:result.secure_url
    }
    const userDataObject={
      name,
      email
    }
    const db=await dbConnection();
    const collection= db.collection('profiles');
    const userCollection=db.collection('users')
    let data=await collection.updateOne({userId:userId},{$set:profiledata})
    let userData=await userCollection.updateOne({_id:new ObjectId(userId)},{$set:userDataObject})
    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
      data
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.get('/profile',async(req,resp)=>{
  const db=await dbConnection();
  const collection=db.collection('profiles');
  let result= await collection.find().toArray()

  resp.send(result)
})
router.delete('/profile/:id',async(req,resp)=>{
  const db=await dbConnection();
  const collection=db.collection('profiles');
   const userId=req.params.id

   try{
    const profile=await collection.findOne({userId})


    if(!profile || !profile.url){
       return resp.status(404).json({ message: 'No image found to delete.' });
    }

    const result=await collection.updateOne({userId}, {$unset:{url:""}})
    resp.status(200).json({ message: 'Profile image deleted successfully',result });
   }
   catch(err){
 console.error('Error deleting profile image:', err);
    resp.status(500).json({ error: 'Failed to delete profile image' });
   }
})

module.exports=router





