const asyncHandler = require('../utils/asyncHandler');
const Book = require('../models/Book');
const Review = require('../models/Review');

const getBooks = asyncHandler(async (req, res) => {
    const pageSize = 5; 
    const page = Number(req.query.pageNumber) || 1;


    const count = await Book.countDocuments({});
    
    const books = await Book.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate('addedBy', 'name email');

    const booksWithAvgRating = await Promise.all(
        books.map(async (book) => {
            const reviews = await Review.find({ bookId: book._id });
            const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            
            const bookObject = book.toObject(); 
            bookObject.averageRating = parseFloat(averageRating);
            bookObject.numReviews = reviews.length;
            return bookObject;
        })
    );

    res.json({
        books: booksWithAvgRating,
        page,
        pages: Math.ceil(count / pageSize),
    });
});

const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');

    if (book) {
        const reviews = await Review.find({ bookId: book._id }).populate('userId', 'name');
        
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
        
        res.json({
            book: book,
            reviews: reviews,
            averageRating: parseFloat(averageRating),
        });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

const createBook = asyncHandler(async (req, res) => {
    const { title, author, description, genre, publishedYear } = req.body;

    const book = new Book({
        title,
        author,
        description,
        genre,
        publishedYear,
        addedBy: req.user._id, 
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
});

const updateBook = asyncHandler(async (req, res) => {
    const { title, author, description, genre, publishedYear } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        if (book.addedBy.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this book');
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;
        book.genre = genre || book.genre;
        book.publishedYear = publishedYear || book.publishedYear;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        // Check if book creator is the logged-in user
        if (book.addedBy.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this book');
        }

        await Book.deleteOne({ _id: req.params.id });
        await Review.deleteMany({ bookId: req.params.id }); 

        res.json({ message: 'Book and associated reviews removed' });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});


module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};