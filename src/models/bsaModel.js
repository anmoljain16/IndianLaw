import mongoose from "mongoose";

const bsaSchema = new mongoose.Schema({

            chapter: {
                type: Number,
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
            },
        });

    const bsaModel = mongoose.models.Bsa || mongoose.model("Bsa", bsaSchema);

    export default bsaModel;
