
const express=require('express');
const dbConnection = require('../mongoDb');
const router=express.Router();
const Fuse = require('fuse.js');

router.get('/', async (req, resp) => {
  const db = await dbConnection();
  const collection = db.collection('restaurants');
  const query = req.query.q?.trim();

  if (!query) {
    return resp.send({ result: [] });
  }

  const data = await collection.find().toArray();

  const options = {
    includeScore: true,
    threshold: 0.4, 
    keys: ['name', 'dishes.name'] 
  };

  const fuse = new Fuse(data, options);
  const result = fuse.search(query).map(r => r.item);

  resp.send({ result });
});

module.exports=router