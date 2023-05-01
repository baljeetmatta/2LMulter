const express=require("express");
const app=express();
const path=require("path")
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

const sessions=require("express-session");
const cookieParser=require("cookie-parser");
app.use(cookieParser());
app.use(sessions({
    saveUninitialized:true,
    resave:false,
    cookie:{maxAge:300000},
    secret:'asdas#$34ra'
}))
const multer=require("multer");
//const upload=multer({dest:'public/files'});
const mstorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/files');


    },
    filename:(req,file,cb)=>{
        console.log(file);
        const ext=file.mimetype.split("/")[1];

        cb(null,`${req.session.username}.${ext}`);

    }
})
const filter=(req,file,cb)=>{

    const ext=file.mimetype.split("/")[1];
    if(ext=="png" || ext=="jpg" || ext=="jpeg")
      cb(null,true);
    else
    cb(new Error("File not supported"),false);




}
const upload=multer({storage:mstorage,fileFilter:filter});




app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/uploadPic.html"));
})
app.post("/upload",upload.single("mypic"),(req,res)=>{
    res.redirect("/dashboard");
    
   // res.end();



})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/login.html"));
})
app.post("/login",(req,res)=>{
    
    console.lo
    if(req.body.username==req.body.password)
    {
        req.session.username=req.body.username;
        res.redirect("/dashboard");

    }
    else
    res.redirect("/login");

})
app.get("/dashboard",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/dashboard.html"));
})
app.listen(3000,(err)=>{
    if(err)
    console.log("Error in server...");
    else
    console.log("Server started");

})
