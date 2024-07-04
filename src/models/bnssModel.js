import mongoose from 'mongoose';

const bnssSchema = new mongoose.Schema({
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
    section_description: {
        type: String,
    },


});

const Bnss = mongoose.models.Bnss || mongoose.model('Bnss', bnssSchema);

export default Bnss;
