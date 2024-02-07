const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            maxLength: 100,
            required: true,
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
