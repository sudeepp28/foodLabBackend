
const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();

const nodemailer = require('nodemailer');
const cloudinary=require('cloudinary').v2
const { ObjectId } = require('mongodb');


cloudinary.config({
  cloud_name: 'dfnzuecxf',
  api_key: '177466569472887',
  api_secret: 'oMXaFqRqR9hcOiSBtr-HJ4fgvsA'
});

// Upload image route
router.post('/upload', async (req, res) => {
  const {userId}=req.body
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
  
     
      url:result.secure_url
    }
   
    const db=await dbConnection();
    const collection= db.collection('profiles');
   
    let data=await collection.updateOne({userId:userId},{$set:profiledata})
   
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

router.post('/update/email',async(req,res)=>{
  const {userId,email}=req.body

  if(!req.body.email){
   return res.status(400).json({ error: 'no email' });
  }
  try{
    const EmailData={
      email
    }
    const user={
      email
    }
    const db=await dbConnection();
    const Pcollection=db.collection('profiles')
    const Ucollection=db.collection('users')
    let presult=await Pcollection.updateOne({userId:userId},{$set:EmailData})
    let uresult=await Ucollection.updateOne({_id: new ObjectId(userId)},{$set:user})
    res.send(presult,uresult)
  }
  catch(err){
    res.send({err:"nothing updated"})
  }
});
router.post('/update/name',async(req,res)=>{
  const {userId,name}=req.body
   if(!req.body.name){
   return res.status(400).json({ error: 'no name' });
  }
  try{
    const nameData={
      name
    }
    const user={
      name
    }
    const db=await dbConnection();
    const Pcollection=db.collection('profiles')
    const Ucollection=db.collection('users')
    let presult=await Pcollection.updateOne({userId:userId},{$set:nameData})
    let uresult=await Ucollection.updateOne({_id: new ObjectId(userId)},{$set:user})
    res.send(presult,uresult)
  }
  catch(err){
    res.send({err:"nothing updated"})
  }
});

router.post('/update/dob',async(req,res)=>{
  const {userId,dob}=req.body

   if(!req.body.dob){
   return res.status(400).json({ error: 'no D.O.B' });
  }
  try{
    const reversedDob=dob.split('-').reverse().join('-')
    const dobData={
      dob:reversedDob
    }
   
    const db=await dbConnection();
    const Pcollection=db.collection('profiles')
   
    let presult=await Pcollection.updateOne({userId:userId},{$set:dobData})
  
    res.send(presult)
  }
  catch(err){
    res.send({err:"nothing updated"})
  }
});
router.post('/update/gender',async(req,res)=>{
  const {userId,gender}=req.body
   if(!req.body.gender){
   return res.status(400).json({ error: 'no gender' });
  }
  try{
    const genderData={
      gender
    }
   
    const db=await dbConnection();
    const Pcollection=db.collection('profiles')
    let presult=await Pcollection.updateOne({userId:userId},{$set:genderData})
    res.send(presult,uresult)
  }
  catch(err){
    res.send({err:"nothing updated"})
  }
});

router.post('/feedback', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // ✅ Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can also use Outlook, Yahoo, etc.
      auth: {
        user: 'sudeepsudeep799@gmail.com',     // your email
        pass: 'ynlt zspe aplm jyyt',       // Gmail App Password, not your real password
      },
    });

    // ✅ Compose mail
    const mailOptions = {
      from: email,
      to: 'sudeepsudeep799@gmail.com',         // where you want to receive the feedback
      subject: `FoodLab Feedback from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // ✅ Send mail
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Feedback sent successfully' });
  } catch (err) {
    console.error('Error sending feedback email:', err);
    res.status(500).json({ message: 'Failed to send feedback' });
  }
});
module.exports=router





