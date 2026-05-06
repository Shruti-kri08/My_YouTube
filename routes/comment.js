require('dotenv').config();
const express = require('express')
const Router = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const User = require('../models/User');
const Video = require('../models/Video');
const Comment = require('../models/Comment');


Router.post('/add/:videoId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        const video=await Video.findById(req.params.videoId)

         if (!video) {
            return res.status(500).json({
                msg: "video not found!"
            })
        }

        const comment=new Comment({
            text:req.body.text,
            userId:tokenData.userId,
            videoId:req.params.videoId
        })
        video.comments.push(comment._id)
        video.commentsCount+=1
        await video.save()
        const result =await comment.save()
        
        res.status(200).json({
           comment:result
        })

    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err
        })
    }
})


Router.post('/delete/:id',async(req,res)=>{
try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        const comment=await Comment.findById(req.params.id)
        if (!comment) {
            return res.status(404).json({
                msg: "comment not found!"
            })
        }

        const video=await Video.findById(comment.videoId)
        if(tokenData.userId!==video.userId || tokenData.userId!==comment.userId){
            return res.status(500).json({
            error:'invalid user'
        })
        }

        const deleteComment=await Comment.findByIdAndDelete(req.params.id)
        video.comments.pop(id)
        commentsCount-=1
        await video.save()

 res.status(200).json({
            msg: "comment deleted successfully",
            comment: deleteComment
        })
}   
catch(err) {
     console.log(err);
        res.status(500).json({
            error: err
      })
}
})


// reply
Router.post('/reply/:commentId',async(req,res)=>{
    try
    {
         const token = req.headers.authorization.split(" ")[1]
         const tokenData = await jwt.verify(token,process.env.SEC_KEY)

         const comment = await Comment.findById(req.params.commentId)
         console.log(comment)

         const newReply = {
            replyText:req.body.replyText,
            userId:tokenData.userId
         }

         comment.reply.push(newReply)
         await comment.save()
         res.status(200).json({
            comment:comment
         })

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


module.exports = Router