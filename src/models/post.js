const { Schema, model } = require('mongoose')

const postSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        caption: {
            type: String,
            maxlength: 200,
        },
        imgURL: {
            type: String,
            required: true,
        },
        likedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        autoIndex: false,
    }
)

module.exports = model('Post', postSchema)
