import mongoose from "mongoose";

const crpcSchema = new mongoose.Schema({

    chapter: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    section_title: {
        type: String,
        required: true
    },
    section_desc: {
        type: String,
        required: true
    }
});

const Crpc = mongoose.models.Crpc || mongoose.model("Crpc", crpcSchema);

export default Crpc;
