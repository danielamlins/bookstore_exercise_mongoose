const https = require("https");
const { app } = require("../app");

const supertest = require("supertest");
const bookData = require("../models/bookModel");
const bookControle = require("../controller/booksController");
const bcrypt = require("bcrypt");

const { createHash } = require('../utils/utils');
jest.useFakeTimers();

class Helper {
  constructor(model) {
    this.apiServer = supertest(app);
  }
}
const helper = new Helper();

beforeAll(() => {
  bookData
    .find()
    .lean()
    .then((data) => {
      if (!data) {
        const book = { title: "title", author: "author" };
        const newBook = new bookData(book);
        newBook.save();
        const book2 = { title: "title2", author: "author2" };
        const newBook2 = new bookData(book2);
        newBook2.save();
      }
    })
    .catch((err) => console.log(err));
});

describe("getBooks", () => {
  test("it should get valid books", async () => {
    const { body } = await helper.apiServer.get(`/books`);
    expect(body).toStrictEqual(
      [{"_id": "60477a833b1c28736097149d", "author": "Tolkien", "price": 30, "title": "The Lord of the Rings", "year": 1954}]
    );
  });
});

describe("createHash", () => {
  test("it should return valid hash", async () => {
     const newHash = await createHash("123");
     const verifyResult = bcrypt.compareSync("123", newHash)
     expect(verifyResult).toBe(true)
  })
})