const express = require("express");
const path = require("path");
const app= express();
const hbs =require("hbs");

require("./db/conn")

const Register= require("./models/registers")

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login",(req, res)=> {
    res.render("login");
})
//create a new user in our DB
app.post("/register", async(req, res) => {
    try {
            
        const password =req.body.password;
        const cpassword =req.body.confirmpassword;

        if(password ===cpassword){
            const registerEmployee = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword
            })
            const registered= await registerEmployee.save();
            res.status(201).render("index");
        }else {
            res.send("password are  not matching")
        }
        console.log(req.body.name); 
            res.send(req.body.name)
    }catch (error){
        res.status(400).send(error);
    }
   
})

//LOGIN CHECK

app.post("/login", async(req, res) => {
    try{
            const email = req.body.email;
            const password =req.body.password;

            const useremail =  await Register.findOne({email: email});
            
            if(useremail.password === password){
                res.status(201).render("index");
            }else {
                res.send("invalid login details");
            }

    }catch (error) {
        res.status(400).send("invalid login details")
    }
})
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})
