import Book from "../model/Bookmodel.js"
import jwt from "jsonwebtoken"


export const getAllBooks = async(req,res,next)=>{
    
    const books = await Book.find();
    try {
        if(!books){
            return res.status(404).json({message:"no result found"})
        }
        return res.status(200).json({books})
    } catch (error) {
        return console.log(error)
    }
}

export const getBookbyId = async(req,res,next)=>{
    const id = req.params.id
    try {
        const book = await Book.findById(id)
        if(!book){
            return res.status(404).json({message:"No book found"})
        }
        return res.status(200).json({book})
    } catch (error) {
        console.log(error)
    }
}

export const AddBook = async(req,res,next) => {
    
    const {title ,authors, genre,publicationYear} = req.body
    
    let book;
    try {
        book = new Book({title,authors, genre,publicationYear})
        book = await book.save()
        if(!book){
            return res.status(500).json({message:"Unexpected error occured"})
        }
        return res.status(201).json({message:"New Book created",book})
    } catch (error) {
        return console.log(error)
    }
}

export const UpdateBook = async(req,res,next)=>{
    
    const id = req.params.id
    const {title ,authors, genre,publicationYear} = req.body
    let book;
    try {
        book = await Book.findByIdAndUpdate(id,{title,authors,genre,publicationYear})
        if(!book){
            return res.status(500).json({message:"Unexpected error has occured"})
        }
        return res.status(200).json({message:"Successfully updated"})
        
    } catch (error) {
        return console.log(error)
    }
}

export const DeleteBook = async(req,res,next)=>{
    
    const id = req.params.id
    let book;
    try {
        book = await Book.findByIdAndDelete(id)
        if(!book){
            return res.status(500).json({message:"unexpected error has occured"})
        }
        return res.status(200).json({message:"Successfully deleted"})
    } catch (error) {
        return console.log(error)
    }
}