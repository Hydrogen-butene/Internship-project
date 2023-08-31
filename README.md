# Internship-project
Install the npm and its dependencies using "npm install"  in comand prompt where package.json file exist.
-------------------------
USE THIS URL TO CONNECT TO MONGODB.
---------------------------------------------------------------------------------------------------------------------
MONGO_URL=""
JWT_SECRET = "ewetwwenwietoqerhwouetuwtgnklgsmlknsoifawetewbgmamnwe"
---------------------------------------------------------------------------------------------------------------------


create a mongodb database and connect with it,

	mongoose.connect(process.env.MONGO_URL)
	.then(()=>console.log("mongoDB is connected")).catch((err)=> console.log(err))


Run the program using "npm start"

Ddotenv is already imported in app.js, for just mare declaration of url, secret and port in dotenv file will work

1. 	MIDDLEWARE TO CHECK WETHER USER IS SIGNED IN OR NOT BY LOOKING AT THE COOKIE STORED
   --------------------------------------------------------------------------------------

	 
const isAuthenticatedUser = async(req, res, next) =>{
    const extractedToken = req.headers.authorization.split(" ")[1]
    	if(!extractedToken && extractedToken.trim() === ""){
        return res.status(404).json({message:"Token not found"})
    }
    jwt.verify(extractedToken, process.env.JWT_SECRET,(err, decrypted)=>{
        if(err){
            return res.status(400).json({message:`${err.message}`})
        }
        return
    })
    next();
};
----------------------------------------------------------------------------------------------------
WHEREVER THIS MIDDLE WARE IS USED, SEND THE TOKEN TO BEARER WHICH YOU WILL GET AFTER SIGNIN API AS RES.------------------------------------------->
----------SEND TOKEN IN->> AUTH->BEARER <<------------------- IN POSTMAN OR IN THUNDER CLIENT OF VISUAL STUDIO-------------------------
TOKEN IS GENERATED AFTER SIGNIN OPERATION.

USE THIS A REFERENCE PIC-> TOKEN SHOULD BE IN AUTH>BEARER---->https://github.com/Hydrogen-butene/Internship-project/assets/87589713/bafa3162-bc4c-4ea4-b683-d140588cc98f)


--------------------------------------------------------------------------------------------------------------------
2 USER API WILL ALLOW ALL KIND OF FUNCTION OF USER SUCH AS LOGIN OR SIGNIN OR LOGOUT
-----------------------------------------------------------------------------------------------------------------------------

===> app.use("/POST/api", userRouter)

THIS WILL DIRECT THE API TO USEROUTER WHER
------------------------------------------------------------------------------------------------------------------------------------------

A. LOGIN IS PERFORMED USING USERNAME, EMAIL ANS PASSWORD
 --> userRouter.post("/register",signup)--> WILL GUIDE THE USER TO SIGNINUP FUNCTION
 -----------------------------------------------------------------------------------
 export const signup = async (req,res,next)=>{
    const {username,email,password} = req.body;
    const hashPassword = bcryptjs.hashSync(password,10)
    const newUser = new User({username, email,password:hashPassword})

    try {
        await newUser.save()
        res.status(201).json({message:"user created"})
    } catch (error) {
        return console.log(error)
    }
     
}

B. SIGN IN IS FERORMED AFTER THE SINUP FUCTION TO AUTHENTICATE WETHER THE USER IS PRESNT IN DATABSE OR NOT----> iF PRESNT, THIS FUCTION WILL CREATE TOKEN USING JWT 
AND WILL BE USED IN ALL THE OPERATION WHICH ONLY USER IS ALLOWED SUCH AS -> ADDING BOOK, DELETING BOOK, UPDATTING BOOK ETC............ THE EXPIRDY DATE IS THE TIME THIS TOKEN IS VALID,
JWT_SECRET KEY IS MADE IN DOTENV FILE FOR SECURITY AND CHECKING THE CORRECTNESS OF TOKEN

userRouter.post("/login",signin)-----------> WILL GUID TO SINGIN FUCTION
-----------------------------------------------------------------------------------------------------------
export const signin = async (req,res,next)=>{
    const {email, password} = req.body

    try {
        const validUser = await User.findOne({email})
        if(!validUser){
            return res.status(404).json({message:'User not found'} )
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword){
            return next(errorHandler(401, 'wrong password'))
        }
        const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET)
        const expiryDate = new Date(Date.now()+3600000000)
        const {password:hashPassword, ...rest} = validUser._doc
        res.cookie('access_token', token, {httpOnly:true, expires:expiryDate}).status(200).json({rest,token})

    } catch (error) {
        return console.log(error)
    }
}


C.   lOGOUT FUCTION IS REMOVE THE TOEKN USING clearCookie  SYNTEX TO NOT ALLOW THE USER WITHOUT TOKEN TO PERFORM ANY RESERVE FUCTION.
THIS CAN BE ONLY PERFORMED MY USER, HENCE MIDDLEWARE IS USED. MIDDLEWARE WILL CHECK WETHER USER IS HAVING TOKEN OR NOT, WHICH WILL BE PRESNT 
INSIDE auth OF HEADER AS bearer token.
-------------------
userRouter.post("/logout",isAuthenticatedUser, Logout)
------------------------------------------------------------------
export const Logout = async(req,res,next)=>{
    
    try {
        res.clearCookie("access_token");
        return res.status(200).json({message:"loged out"})
    } catch (error) {
        return console.log(error)
    }
    
}
-----------------------------------------------------------------------------------------------------------------------------
3.FUCTION ONLY USER CAN PERFORM ---- CURD OPERATION FOR BOOKS.
---------------------------------------------------------------------------------------------------------------------------------
A.ADDING THE BOOK---------------------
	bookRouter.post("/books",isAuthenticatedUser,AddBook)

--------------------------------------
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

B.. GETTING ALL BOOK FROM DATABASE-----------------------------------------
	bookRouter.get("/books",isAuthenticatedUser,getAllBooks)
 --------------------------------------------------------------
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

C. 	GETTING BOOK BY ID--------------------------------------------------------
	bookRouter.get("/books/:id",isAuthenticatedUser, getBookbyId)
---------------------------------------------------------------------------------
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

D. UPDATE BOOK BY ID-----------------------------------------------------------------
bookRouter.put("/books/:id",isAuthenticatedUser,UpdateBook)
-------------------------------------------------------------------------
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

E. DELETE BOOK BY ID---------------------------------------------------------
   bookRouter.delete("/books/:id",isAuthenticatedUser, DeleteBook)
   -----------------------------------------------------------------------------
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



