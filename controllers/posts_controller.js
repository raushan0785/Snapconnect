const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.create = async function(req, res) {
    try {
        const content = req.body.content;
        const user = req.user;

        if (!content) {
            return res.status(400).send('Content is required');
        }

        // Create post data
        let postData = {
            content: content,
            user: user._id
        };

        // Handle image upload
        Post.uploadedPostImage(req, res, function(err) {
            if (err) {
                console.log('Multer error:', err);
                return res.redirect('back');
            }

            // If image was uploaded, add image path to post data
            if (req.file) {
                postData.image = Post.postImagePath + '/' + req.file.filename;
            }

            // Create the post
            Post.create(postData)
                .then(() => {
                    return res.redirect('/');
                })
                .catch((err) => {
                    console.log('Error creating post:', err);
                    return res.redirect('back');
                });
        });
    } catch (err) {
        console.log('Error creating post:', err);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports.destroy = function(req, res) {
    Post.findById(req.params.id)
        .then((post) => {
            if (!post) {
                console.log('Post not found');
                return res.redirect('back');
            }

            // Check if user can delete the post
            if (post.user.toString() !== req.user.id) {
                console.log('Unauthorized attempt to delete a post');
                return res.redirect('back');
            }

            // Delete image file if exists
            if (post.image) {
                const imagePath = path.join(__dirname, '..', post.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Delete the post
            return Post.deleteOne({ _id: req.params.id });
        })
        .then(() => {
            console.log('Post deleted successfully');
            return res.redirect('back');
        })
        .catch((err) => {
            console.log('Error in deleting the post:', err);
            return res.redirect('back');
        });
};

