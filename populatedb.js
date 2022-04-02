console.log(
  "This script populates database with current items. Specified database as argument - e.g.: populatedb mongodb+srv://username:password@inventory.ih7oq.mongodb.net/inventory?retryWrites=true&w=majority"
);

const bcrypt = require("bcryptjs");

const userArgs = process.argv.slice(2);

const async = require("async");
const Author = require("./models/author");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const authors = [];

function authorCreate(username, password, cb) {
  const hash = bcrypt.hash(password, 10);
  authorDetail = {
    username: username,
    password: hash,
  };

  const author = new Author(authorDetail);

  author.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Author: ${author}`);
    authors.push(author);
    cb(null, author);
  });
}

function createAuthors(cb) {
  async.parallel([
    function (callback) {
      authorCreate("Gbarda", "qqqqqq", callback);
    },
    function (callback) {
      authorCreate("Abarda", "qqqqqq", callback);
    },
  ]);
}

async.series([createAuthors], function (err, results) {
  if (err) {
    console.log(`final err:${err}`);
  }
  mongoose.connection.close();
});
