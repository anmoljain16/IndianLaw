import mongoose from "mongoose";

const ieaSchema = new mongoose.Schema({

    chapter: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    section_title: {
        type: String,
        required: true,
    },
    section_desc: {
        type: String,
        required: true,
    },
});

const ieaModel = mongoose.models.Iea ||mongoose.model("Iea", ieaSchema);

export default ieaModel;
