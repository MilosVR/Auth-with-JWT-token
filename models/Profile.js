const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user:{
        //=== user _id
        type : mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    company:{
        type:String
    },
    location:{
        type:String
    },
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String
    },
    githubusername:{
        type:String
    },
    experience: [
        {
            title:{
                type:String,
                required:true
            },
            company:{
                type:String,
                required:true
            },
            location:{
                type:String,
                required:true
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date,
            },
            current: {
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
        }
    ],
    educations: [
        {
            school:{
                type:String,
                required:true
            },
            degree:{
                type:String,
                required:true
            },
            fieldofstudy:{
                type:String,
                required:true
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date,
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String, 
            },
        }
    ],
    social:{
        youtube:{
            type:String,
        },
        twitter:{
            type:String,
        },
        facebook:{
            type:String,
        },
        linkedin:{
            type:String,
        },
        instagram:{
            type:String,
        },
    },
    data: {
        type:Date,
        default:Date.now
    }  
})

module.exports = mongoose.model('profile', ProfileSchema )