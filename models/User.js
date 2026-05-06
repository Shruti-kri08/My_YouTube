const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    fullname:{
            type:String,
            require:true,
            trim: true,
 
    },

    email:{
            type:String,
            require:true,
            unique: true,
            lowercase: true,
            trim: true,
    }, 

    password:{
            type:String,
            require:true,
    
    },

    phone:{
            type:String,
            require:true
    },

    imageUrl:{
            type:String,
        //     require:true,
            default:" "
    },

    imageId:{
            type:String,
        //     require:true,
            default:" "
    },

    subscriber:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"       
    }],
    subscription:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
    }],
   
})

module.exports=mongoose.model('user',userSchema)