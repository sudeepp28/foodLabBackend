const express=require('express');
const cors=require('cors')
const app= express();

const fileUpload = require('express-fileupload');
const uploadRoute=require('./routes/upload')
const savedRoute=require('./routes/saved')
const RestaurantsRoute=require('./routes/resturants')
const cartRoute=require('./routes/cart')
const orderRoute=require('./routes/order')
const searchRoute=require('./routes/search')
const authRoute=require('./routes/auth')

const verify=require('./middleware/auth-middleware')

app.use(express.json())
app.use(cors());

app.use(fileUpload({ useTempFiles: true }));
app.use('/',uploadRoute)
app.use('/',RestaurantsRoute)
app.use('/cart',verify,cartRoute)
app.use('/order',verify,orderRoute)
app.use('/saved',verify,savedRoute)
app.use('/searches',searchRoute)
app.use('/',authRoute)




app.listen(5000)