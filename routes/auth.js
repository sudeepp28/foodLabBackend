const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();
const { ObjectId } = require('mongodb');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
router.post('/register',async(req,resp)=>{
  const db=await dbConnection();
  const users=db.collection('users')
  const profiles=db.collection('profiles')
    const { name, email, password } = req.body;
     const existingUser = await users.findOne({ email });
  if (existingUser) return resp.status(400).send({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword };

  const result = await users.insertOne(newUser);

  const userId=result.insertedId;

  await profiles.insertOne({
     userId: userId.toString(),
      name,
      email,
  })

  resp.send({result, message:"profile created"});
});
router.post('/login',async (req,resp)=>{
   const db = await dbConnection();
  const users = db.collection('users');
  const { email, password } = req.body;

  const user = await users.findOne({ email });
  if (!user) return resp.status(400).send({ message: 'Invalid email or password' });

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) return resp.status(400).send({ message: 'Invalid email or password' });

  const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

  resp.send({ token, user});
});

router.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('🔐 Change password request for userId:', userId);
    const db = await dbConnection();
    const collection = db.collection("users");

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('❌ Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports=router