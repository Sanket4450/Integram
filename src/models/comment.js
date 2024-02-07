const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        text: {
            type: String,
            maxlength: 100,
        },
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    {
        timestamps: true,
        autoIndex: false,
    }
)

module.exports = model('Comment', commentSchema)
