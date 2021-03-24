const express = require('express');
const app = express();
const hostname = '127.0.0.2';
const port = process.env.PORT || 3000;
const path = require('path');


// Establish connection to Mongoose
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017";
const dbName = "bookstore"

mongoose.set("useFindAndModify", false);

mongoose.connect("mongodb://localhost:27017/bookstore", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", console.error);



// Middlewares
const morgan = require('morgan');
app.use(morgan('dev'));

const books = require('./routes/books');
const users = require('./routes/users');
const orders = require('./routes/orders');


const { setCors } = require('./middleware/security');

const lowDB = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/db.json');
const db = lowDB(adapter)
db.defaults({ books: [], users: [] }).write();

//Middlewares
app.use(setCors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use('/books', books);
app.use('/users', users);
app.use('/orders', orders);

// Endpoints
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

// Error Handling
app.use((req, res, next) => {
    const error = new Error ('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


// Listen
app.listen(port, () => console.log(`Server listening at http://${hostname}:${port}`));


exports.app = app;