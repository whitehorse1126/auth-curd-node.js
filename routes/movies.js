const router = require('express').Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Input validation package
// https://www.npmjs.com/package/validator
const validator = require('validator');

// require the database connection
const {
    sql,
    dbConnPoolPromise
} = require('../database/db.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM dbo.Movies ORDER BY MoviesName ASC for json path;';

const SQL_select_join = 'SELECT b.MoviesId, b.MoviesName, b.MoviesDescription, b.MoviesRating, b.MoviesLength, a.PublisherName FROM dbo.Movies as b JOIN dbo.Publisher as a ON (b.PublisherId = a.PublisherId) for json path;'
    //join to get novelist's name as well

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM dbo.Movies WHERE MoviesId = @id for json path, without_array_wrapper;';



// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_CATID = 'SELECT * FROM dbo.Movies WHERE CategoryId = @id ORDER BY MoviesName ASC for json path;';

const SQL_select_by_join = 'SELECT b.MoviesId, b.MoviesName, b.MoviesDescription, b.MoviesRating, b.MoviesLength, a.PublisherName FROM dbo.Movies as b JOIN dbo.Publisher as a ON (b.PublisherId = a.PublisherId) WHERE b.CategoryId = @id ORDER BY b.MoviesName ASC for json path;'

// Second statement (Select...) returns inserted record identified by MoviesId = SCOPE_IDENTITY()
const SQL_INSERT = 'INSERT INTO dbo.Movies (CategoryId, PublisherId,  MoviesName, MoviesDescription, MoviesRating, MoviesLength) VALUES (@CategoryId, @PublisherId,  @MoviesName, @MoviesDescription, @MoviesRating, @MoviesLength); SELECT * from dbo.Movies WHERE MoviesId = SCOPE_IDENTITY();';
const SQL_UPDATE = 'UPDATE dbo.Movies SET CategoryId = @CategoryId, PublisherId = @PublisherId, MoviesName = @MoviesName, MoviesDescription = @MoviesDescription, MoviesRating = @MoviesRating, MoviesLength = @MoviesLength WHERE MoviesId = @MoviesId; SELECT * FROM dbo.Movies WHERE MoviesId = @MoviesId;';
const SQL_DELETE = 'DELETE FROM dbo.Movies WHERE MoviesId = @id;';


// GET listing of all Movies
// Address http://server:port/Movies
// returns JSON
router.get('/', async(req, res) => {

    // Get a DB connection and execute SQL
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_select_join);

        // Send HTTP response.
        // JSON data from MS SQL is contained in first element of the recordset.
        res.json(result.recordset[0]);

        // Catch and send errors  
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// GET a single Movies by id
// id passed as parameter via url
// Address http://server:port/Movies/:id
// returns JSON
router.get('/:id', async(req, res) => {

    // read value of id parameter from the request url
    const MoviesId = req.params.id;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // See link to validator npm package (at top) for doc.
    // If validation fails return an error message
    if (!validator.isNumeric(MoviesId, {
            no_symbols: true
        })) {
        res.json({
            "error": "invalid id parameter"
        });
        return false;
    }

    // If validation passed execute query and return results
    // returns a single Movies with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set name parameter(s) in query
            .input('id', sql.Int, MoviesId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        res.json(result.recordset[0])

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// GET Movies by category id
// id passed as parameter via url
// Address http://server:port/Movies/:id
// returns JSON
router.get('/bycat/:id', async(req, res) => {

    // read value of id parameter from the request url
    const categoryId = req.params.id;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // See link to validator npm package (at top) for doc.
    // If validation fails return an error message
    if (!validator.isNumeric(categoryId, {
            no_symbols: true
        })) {
        res.json({
            "error": "invalid id parameter"
        });
        return false;
    }

    // If validation passed execute query and return results
    // returns a single Movies with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set name parameter(s) in query
            .input('id', sql.Int, categoryId)
            // execute query
            .query(SQL_select_by_join);

        // Send response with JSON result    
        res.json(result.recordset[0])

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// POST - Insert a new Movies.
// This async function sends a HTTP post request
router.post('/', passport.authenticate('jwt', {
        session: false
    }),
    async(req, res) => {
        console.log('res',req);
        // Validate - this string, inially empty, will store any errors
        let errors = "";

        // Make sure that category id is just a number - note that values are read from request body
        const categoryId = req.body.CategoryId;
        if (!validator.isNumeric(categoryId, {
                no_symbols: true
            })) {
            errors += "invalid Category id; ";
        }
        const publisherId = req.body.PublisherId;
        if (!validator.isNumeric(publisherId, {
                no_symbols: true
            })) {
            errors += "invalid Publisher id; ";
        }
        // Escape text and potentially bad characters
        const moviesName = validator.escape(req.body.MoviesName);
        if (moviesName === "") {
            errors += "invalid MoviesName; ";
        }
        const moviesDescription = validator.escape(req.body.MoviesDescription);
        if (moviesDescription === "") {
            errors += "invalid MoviesDescription; ";
        }
        // Make sure that category id is just a number
        const moviesRating = req.body.MoviesRating;
        if (!validator.isNumeric(moviesRating, {
                no_symbols: true
            })) {
            errors += "invalid MoviesRating; ";
        }
        // Validate currency
        const moviesLength = req.body.MoviesLength;
        if (!validator.isCurrency(moviesLength, {
                allow_negatives: false
            })) {
            errors += "invalid moviesLength; ";
        }

        // If errors send details in response
        if (errors != "") {
            // return http response with  errors if validation failed
            res.json({
                "error": errors
            });
            return false;
        }

        // If no errors, insert
        try {
            // Get a DB connection and execute SQL
            const pool = await dbConnPoolPromise
            const result = await pool.request()
                // set named parameter(s) in query
                .input('CategoryId', sql.Int, categoryId)
                .input('PublisherId', sql.Int, publisherId)
                .input('MoviesName', sql.NVarChar, moviesName)
                .input('MoviesDescription', sql.NVarChar, moviesDescription)
                .input('MoviesRating', sql.Decimal, moviesRating)
                .input('MoviesLength', sql.Decimal, moviesLength)
                // Execute Query
                .query(SQL_INSERT);

            // If successful, return inserted Movies via HTTP   
            res.json(result.recordset[0]);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

    });

// PUT update Movies
// Like post but MoviesId is provided and method = put
router.put('/:MoviesId', passport.authenticate('jwt', {
        session: false
    }),
    async(req, res) => {

        // Validate input values (sent in req.body)
        let errors = "";
        const moviesId = req.params.MoviesId;
        if (!validator.isNumeric(moviesId, {
                no_symbols: true
            })) {
            errors += "invalid Movies id; ";
        }
        const categoryId = req.body.CategoryId;
        if (!validator.isNumeric(categoryId, {
                no_symbols: true
            })) {
            errors += "invalid category id; ";
        }
        const publisherId = req.body.PublisherId;
        if (!validator.isNumeric(publisherId, {
                no_symbols: true
            })) {
            errors += "invalid Publisher id; ";
        }

        const moviesName = validator.escape(req.body.MoviesName);
        if (moviesName === "") {
            errors += "invalid moviesName; ";
        }
        const moviesDescription = validator.escape(req.body.MoviesDescription);
        if (moviesDescription === "") {
            errors += "invalid moviesDescription; ";
        }
        const moviesRating = req.body.MoviesRating;
        if (!validator.isNumeric(moviesRating, {
                no_symbols: true
            })) {
            errors += "invalid MoviesRating; ";
        }
        const moviesLength = req.body.MoviesLength;
        if (!validator.isCurrency(moviesLength, {
                allow_negatives: false
            })) {
            errors += "invalid MoviesLength; ";
        }

        // If errors send details in response
        if (errors != "") {
            // return http response with  errors if validation failed
            res.json({
                "error": errors
            });
            return false;
        }

        // If no errors   
        try {
            // Get a DB connection and execute SQL
            const pool = await dbConnPoolPromise
            const result = await pool.request()
                // set parameters
                .input('MoviesId', sql.Int, moviesId)
                .input('CategoryId', sql.Int, categoryId)
                .input('PublisherId', sql.Int, publisherId)
                .input('MoviesName', sql.NVarChar, moviesName)
                .input('MoviesDescription', sql.NVarChar, moviesDescription)
                .input('MoviesRating', sql.Decimal, moviesRating)
                .input('MoviesLength', sql.Decimal, moviesLength)
                // run query
                .query(SQL_UPDATE);

            // If successful, return updated Movies via HTTP    
            res.json(result.recordset[0]);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

    });

// DELETE single task.
router.delete('/:id', passport.authenticate('jwt', {
        session: false
    }),
    async(req, res) => {

        // Validate
        const MoviesId = req.params.id;

        // If validation fails return an error message
        if (!validator.isNumeric(MoviesId, {
                no_symbols: true
            })) {
            res.json({
                "error": "invalid id parameter"
            });
            return false;
        }

        // If no errors try delete
        try {
            // Get a DB connection and execute SQL
            const pool = await dbConnPoolPromise
            const result = await pool.request()
                .input('id', sql.Int, MoviesId)
                .query(SQL_DELETE);


            const rowsAffected = Number(result.rowsAffected);

            let response = {
                "deletedId": null
            }

            if (rowsAffected > 0) {
                response = {
                    "deletedId": MoviesId
                }
            }

            res.json(response);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    });

module.exports = router;