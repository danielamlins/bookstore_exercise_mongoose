// const lowDB = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const adapter = new FileSync("data/db.json");
// const db = lowDB(adapter);
// db.defaults({ books: [], users: [], orders: [] }).write();

const { UserData, AddressData } = require("../models/userModel");
const ObjectID = require("mongodb").ObjectID;

const utils = require("../utils/utils");
// const hash = utils.createHash();

const { createHash } = require("../utils/utils");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.getUser = function (req, res) {
  UserData.find()
    .populate("address")
    .lean()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.addUser = function (req, res) {
  // exports.addUser = async function (req, res) {
  // const newHash = await createHash(req.body.password);

  const address = {
    street: req.body.street,
    city: req.body.city,
  };
  const newAddress = new AddressData(address);

  newAddress.save(function (error) {
    if (error) return handleError(error);

    // Create and save user
    const newHash = bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        console.log(hash);
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          address: newAddress._id,
          password: hash,
        };

        const newUser = new UserData(user);
        newUser
          .save()
          .then(res.json({ success: true }))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // Alternative
  // const salt = bcrypt.genSaltSync(10);
  // const hash =  bcrypt.hashSync(password, salt)

  // bcrypt
  //   .hash(req.body.password, 10)
  //   .then((hash) => {
  //     const user = {
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       email: req.body.email,
  //       password: hash,
  //     };

  // const newUser = new UserData(user);
  // newUser.save();
  // res.json({ success: true });
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     res.json({
  //       error: {
  //         message: err.message,
  //       },
  //     });
  //   });
};

exports.getUserById = function (req, res) {
  const id = { _id: ObjectID(req.params.id) };
  UserData.findOne(id, (err, user) => {
    if (err) {
      console.log(error);
      res.json({ error: error.message });
    } else {
      res.json(user);
    }
  });
};

exports.updateUser = function (req, res) {
  UserData.findOne({ _id: ObjectID(req.params.id) }, (err, user) => {
    if (err) {
      console.log(error);
      res.json({ error: error.message });
    } else {
      if (req.body.password) {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            console.log(hash);
            const newUser = {
              firstName: req.body.firstName || user.firstName,
              lastName: req.body.lastName || user.lastName,
              email: req.body.email || user.email,
              id: user.id,
              password: hash,
            };

            const newUserDoc = new UserData(newUser);
            UserData.updateOne(
              { _id: ObjectID(req.params.id) },
              newUserDoc,
              function (err, updatedItem) {
                if (err) {
                  console.log("Error:" + err);
                } else {
                  console.log("Success:" + updatedItem);
                }
                res.json(newUser);
              }
            );
          })
          .catch((err) => {
            console.log(err);
            return res.json({
              error: {
                message: err.message,
              },
            });
          });
      } else {
        const newUser = {
          firstName: req.body.firstName || user.firstName,
          lastName: req.body.lastName || user.lastName,
          email: req.body.email || user.email,
          password: user.password,
          id: user.id,
        };
        UserData.updateOne(
          { _id: ObjectID(req.params.id) },
          newUser,
          function (err, updatedItem) {
            if (err) {
              console.log("Error:" + err);
            } else {
              console.log("Success:" + updatedItem);
            }
            res.json(newUser);
          }
        );
      }
    }
  });
};

exports.removeUser = function (req, res) {
  const id = req.params.id;
  console.log(id);
  UserData.findByIdAndRemove(
    { _id: ObjectID(id) },
    function (err, deletedItem) {
      if (err) {
        console.log("Error" + err);
      } else {
        console.log(deletedItem);
        res.json({ succes: true, message: "deleted" });
      }
    }
  );
};

// Usually, we store these tokens in a db
let refreshTokens = [];

exports.login = function (req, res) {
  console.log("ok");
  UserData.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log(result);
        if (result) {
          // We need to have a token secret saved on out env file.
          // TO generate the TOKEN SECRET, we go to the terminal and run node
          // the run require('crypto').randomBytes(64).toString('hex'), and it will generate a random 64byte string in hexadecimal,a nd we can use it
          const token = jwt.sign(
            { email: user.email, userId: user.i_id },
            process.env.JWT_KEY,
            { expiresIn: "30min" }
          );

          const refreshToken = jwt.sign(
            { email: user.email, userId: user.i_id },
            process.env.REFRESH_KEY
          );
          refreshTokens.push(refreshToken);

          return res
            .status(200)
            .json({
              message: "Success",
              token: token,
              refreshToken: refreshToken, //this will be saved in local storage
            });
        }
        return res.status(401).json({ message: "Auth failed" });
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "User not found", error: err });
    });
};

exports.refreshToken = function (req, res) {
  const refreshToken = req.body.token;
  if (refreshToken === null ) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAcessToken({name: user.name});
    res.json({accessToken: accessToken})
  })
};

exports.logout = function(req, res) {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
}