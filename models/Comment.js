const mongoose=require('mongoose')
const replySchema = new mongoose.Schema({
  replyText:String,
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
   time: {
    type: Date,
    default: Date.now
  }
},{timestamps:true})

const commentSchema=new mongoose.Schema({
        text:{
            type:String,
            trim:true,
            required:true,
            maxlength:1000
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },

        likedBy:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }],

        likeCount:{
            type:Number,
            default:0
        } ,

        dislikedBy:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }],

        dislikeCount:{
            type:Number,
            default:0
        },
        vedioId:{
                type:mongoose.Schema.Types.ObjectId,
              ref:'video'
        }
        ,
        reply:[replySchema]

},{
       timestamps:true
 
})

module.exports=mongoose.model('comment',commentSchema)