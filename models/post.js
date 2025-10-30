const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const POST_IMAGE_PATH = path.join('/uploads/posts/images');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments:[
        {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
        }
    ]
}, {
    timestamps: true
});

// Multer configuration for post images
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', POST_IMAGE_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

// Static method for uploading post images
postSchema.statics.uploadedPostImage = multer({storage: storage}).single('image');
postSchema.statics.postImagePath = POST_IMAGE_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;