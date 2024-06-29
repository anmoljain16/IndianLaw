import mongoose from "mongoose";

const BnsModel = new mongoose.Schema({

        sectionNo:{
            type:String,
        },
        sectionTitle:{
            type:String,
        },
        sectionDescription:{
            type:String,
        },
        subSectionTitle:{
            type:String,
    },
        subSectionDescription:{
            type:String,
        },
        combinedData:{
            type:String,
        },

    },
    {
        timestamps:true,
    })

const Bns = mongoose.models.Bns || mongoose.model("Bns", BnsModel);

export default Bns;
