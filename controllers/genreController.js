var Genre = require('../models/genre');
var async = require('async');
var Book = require('../models/book');
var mongoose = require('mongoose');

const { body, validationResult } = require("express-validator");


// Display list of all Genre.
exports.genre_list = (req, res) => {
    Genre.find()
    .sort({'name': 'ascending'})
    .exec( function (err, genre_list) {
        if (err) { return next(err);}

        else {
            res.render('genre_list', {title: 'Genre List', genre_list: genre_list})
        }
    })
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel(
        {
            genre: function(callback) {
                Genre.findById(id)
                .exec(callback); },
            
            genre_books: function(callback) {
                Book.find({ 'genre': id})
                .exec(callback);

            },
            
        },
        function (err, result) {
            if (err) {return next(err);}

            if (result.genre==null) {
                var err = new Error('Genre not found');
                err.status = 404;
                return next(err)
            }

            res.render('genre_detail', {title: "Genre Detail", genre: result.genre, genre_books: result.genre_books});
            
        }
    );
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
    res.render('genre_form', {title: 'Create Genre'})
};

// Handle Genre create on POST.
exports.genre_create_post = [
    body('name', 'Genre name required').trim().escape().isLength({ min: 1}),

    (req, res, next) => {
        const errors = validationResult(req);
        var genre = new Genre(
            {name: req.body.name}
        );

        if (!errors.isEmpty()) {
            //Errors in form
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }

        else {
            //Valid form data

            //Check if Genre exists
            Genre.findOne({'name': req.body.name})
            .exec( function(err, found_genre ) {
                if (err) { return next(err)}

                if (found_genre) {
                    //Genre exist
                    res.redirect(found_genre.url);
                }

                else {
                    genre.save(function (err) {
                        if (err) { return next(err)}

                        res.redirect(genre.url)
                    });
                }
            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
