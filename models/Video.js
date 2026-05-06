const mongoose=require('mongoose')
const videoSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },

    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:120
    }, 
    description:{
        type:String,
        trim:true,
        maxlength:1000
    },
    tags:[
        {
            type:String,
            lowercase:true,
            trim:true
        }
    ],

    category: {
    type: String,
    enum: [
      "education",
      "entertainment",
      "music",
      "gaming",
      "technology",
      "news",
      "sports",
      "other"
    ],
    default: "other"
  },


  thumbnailId:{
    type:String
  } ,

  thumbnailUrl:{
    type:String
  },
  videoId:{
    type:String,
    required:true
  },

  videoUrl:{
    type:String,
    required:true
  },

  views:{
    type:Number,
    default:0
  },

  likesCount:{
    type:Number,
    default:0
  },
  likedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'

  }],

  dislikesCount:{
    type:Number,
    default:0
  },
  dislikedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'

  }],
  comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'comment'

  }],
 commentsCount:{
    type:Number,
    default:0
  },

publishedAt:{
    type:Date,
    default:Date.now
}
}, {
    timestamps:true
});

module.exports = mongoose.model("video",videoSchema);