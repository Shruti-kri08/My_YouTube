require('dotenv').config();
const express = require('express')
const Router = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const User = require('../models/User');
const Video = require('../models/Video');
const Comment = require('../models/Comment');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

//video upload routes
Router.post('/upload', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        const uploadedvideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, { resource_type: "video", folder: "MY_Youtube_video" })
        const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, { resource_type: "image", folder: "MY_Youtube_Thumbnail" })

        const newvideo = new Video({
            userId: tokenData.userId,
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            category: req.body.category,
            videoUrl: uploadedvideo.secure_url,
            videoId: uploadedvideo.public_id,
            thumbnailUrl: uploadedThumbnail.secure_url,
            thumbnailId: uploadedThumbnail.public_id
        })

        const result = await newvideo.save()

        res.status(200).json({
            video: result
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})


//get all video
Router.get('/all-video', async (req, res) => {
    try {
        const allvideo = await Video.find().select("_id title likesCount dislikesCount comments commentsCount thumbnailUrl userId publishedAt").populate('userId', "fullname imageUrl ").populate('comments','text' )

        res.status(200).json({
            videos: allvideo
        })
    }
    catch (err) {
        console.log(err)

        res.status(500).json({
            error: err
        })
    }
})

//by video id
Router.get('/byId/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)

        if (!video) {
            return res.status(500).json({
                message: "video not found"
            })
        }

        video.views += 1;

        await video.save()

        res.status(200).json({
            video: video
        })
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err
        })
    }
})

//get video by userId
Router.get('/byUserId/:id', async (req, res) => {
    try {
        const videos = await Video.find({ userId: req.params.id })

        if (videos.length == 0) {
            return res.status(500).json({
                msg: "video not found!"
            })
        }

        res.status(200).json({
            videos: videos
        })
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err
        })
    }
})


//like and unlike
Router.post('/likeAndUnlike/:videoId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        const tokenData = jwt.verify(token, process.env.SEC_KEY)

        const userId = tokenData.userId

        const video = await Video.findById(req.params.videoId)

        const isliked = video.likedBy.includes(userId)

        if (isliked) {
            video.likedBy = video.likedBy.filter(uId => uId != userId)

            video.likesCount -= 1
        }
        else {
            video.likedBy.push(userId)

            video.likesCount += 1
        }

        await video.save()

        res.status(200).json({
            likeCount: video.likesCount
        })

    }
    catch (err) {
        console.log(err)

        res.status(500).json({
            error: err
        })
    }
})

//Dislike and remove dislike api
Router.post('/dislike/:videoId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        const tokenData = jwt.verify(token, process.env.SEC_KEY)

        const userId = tokenData.userId

        const video = await Video.findById(req.params.videoId)

        const isDislike = video.dislikedBy.includes(userId)

        if (isDislike) {
            video.dislikedBy = video.dislikedBy.filter(uId => uId != userId)

            video.dislikesCount -= 1
        }
        else {
            video.dislikedBy.push(userId)

            video.dislikesCount += 1
        }

        await video.save()

        res.status(200).json({
            dislikeCount: video.dislikesCount
        })
    }

    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err
        })
    }

})

// Router.post('/upload-comment/:videoId', async (req, res) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1]
//         const tokenData = jwt.verify(token, process.env.SEC_KEY)
//         const video=await Video.findById(req.params.videoId)

//          if (!video) {
//             return res.status(500).json({
//                 msg: "video not found!"
//             })
//         }

//         const comment=new Comment({
//             text:req.body.text,
//             userId:tokenData.userId,
//             videoId:req.params.videoId
//         })
//         video.comments.push(comment._id)
//         video.commentsCount+=1
//         await video.save()
//         const result =await comment.save()
        
//         res.status(200).json({
//            comment:result
//         })

//     }
//     catch (err) {
//         console.log(err);

//         res.status(500).json({
//             error: err
//         })
//     }
// })


// Router.post('/comment-delete/:id',async(req,res)=>{
// try{
//         const token = req.headers.authorization.split(" ")[1]
//         const tokenData = jwt.verify(token, process.env.SEC_KEY)
//         const comment=await Comment.findById(req.params.id)
//         if (!comment) {
//             return res.status(404).json({
//                 msg: "comment not found!"
//             })
//         }

//         const video=await Video.findById(comment.vedioId)
//         if(tokenData.userId!==video.userId || tokenData.userId!==comment.userId){
//             return res.status(500).json({
//             error:'invalid user'
//         })
//         }

//         const deleteComment=await Comment.findByIdAndDelete(req.params.id)
//         video.comments.pop(id)
//         commentsCount-=1
        

//  res.status(200).json({
//             msg: "comment deleted successfully",
//             comment: deleteComment
//         })
// }   
// catch(err) {
//      console.log(err);
//         res.status(500).json({
//             error: err
//       })
// }
// })


// // reply
// Router.post('/reply/:commentId',async(req,res)=>{
//     try
//     {
//          const token = req.headers.authorization.split(" ")[1]
//          const tokenData = await jwt.verify(token,process.env.SEC_KEY)

//          const comment = await Comment.findById(req.params.commentId)
//          console.log(comment)

//          const newReply = {
//             replyText:req.body.replyText,
//             userId:tokenData.userId
//          }

//          comment.reply.push(newReply)
//          await comment.save()
//          res.status(200).json({
//             comment:comment
//          })

//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(500).json({
//             error:err
//         })
//     }
// })



module.exports = Router