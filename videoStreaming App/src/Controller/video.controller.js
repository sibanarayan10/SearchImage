import { uploadFile } from "../Utils/cloudinary.js";

const addVideo=async(req,res)=>{
    const{title}=req.body;
    if(!title){
        throw "title is required";
    }
    console.log(req.file);
    try{
    const upload=await uploadFile(req.file.path);
    console.log(upload);}
    catch(err){
        throw err;
    }
}
export {addVideo}