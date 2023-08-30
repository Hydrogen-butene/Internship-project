import express from "express"
import isAuthenticatedUser from "./../middleware/Auth.js"
import { AddBook, DeleteBook, UpdateBook, getAllBooks, getBookbyId } from "../controller/book-controller.js"

const bookRouter = express.Router()



bookRouter.get("/books",isAuthenticatedUser,getAllBooks)
bookRouter.get("/books/:id",isAuthenticatedUser, getBookbyId)
bookRouter.post("/books",isAuthenticatedUser,AddBook)
bookRouter.put("/books/:id",isAuthenticatedUser,UpdateBook)
bookRouter.delete("/books/:id",isAuthenticatedUser, DeleteBook)

export default bookRouter;

