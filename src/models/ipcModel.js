import mongoose from "mongoose";

const IpcModel = new mongoose.Schema({
    chapterNumber:{
        type:Number,
    },
    chapterTitle:{
        type:String,
    },
    sectionNo:{
        type:String,
    },
    sectionTitle:{
        type:String,
    },
    sectionDescription:{
        type:String,
    },

},
    {
    timestamps:true,
})

const Ipc = mongoose.models.Ipc || mongoose.model("Ipc", IpcModel);

export default Ipc;
