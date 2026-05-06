require('dotenv').config();
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser=require('body-parser');
const fileUpload = require('express-fileupload');



//import routes
const userRoutes=require('./routes/user')
const videoRoutes=require('./routes/video')
const commentRoutes=require('./routes/comment')


//connect with database
const connectWithDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connect with DB...");
        
    }
    catch (err) {
        console.log(err);

    }
}


connectWithDatabase()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(fileUpload(
    {
    
    useTempFiles:true,        
    tempFileDir:'/temp/'

    }
))


app.use('/user',userRoutes)
app.use('/video',videoRoutes)
app.use('/comment',commentRoutes)



module.exports = app