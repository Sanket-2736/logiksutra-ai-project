const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        author: {
            type: String,
            required: [true, 'Please add an author'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        genre: {
            type: String,
            required: [true, 'Please add a genre'],
        },
        publishedYear: {
            type: Number,
            required: [true, 'Please add a published year'],
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, 
        toObject: { virtuals: true }, 
    }
);


const Book = mongoose.model('Book', bookSchema);
module.exports = Book;