import mongoose,{Schema} from 'mongoose'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

 const userSchema=new Schema({
   FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    PhoneNumber:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    profileImage:{
        type:String,

    },
    Password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true
    },
    role:{
        type:String,
    },
    refreshToken: {
        type: String
    }
    
 },{timestamps:true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("Password")) return next();

    this.Password = await bcrypt.hash(this.Password, 10)
    this.confirmPassword=await bcrypt.hash(this.confirmPassword,10);
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.Password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
             _id: this._id,
            Email: this.Email,
            LastName: this.LastName,
            FirstName: this.FirstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken =function(){
    return  jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema);