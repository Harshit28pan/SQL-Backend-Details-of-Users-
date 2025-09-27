const { faker } = require('@faker-js/faker');
const mysql= require('mysql2');


// let getRandomUser = () =>{
//   return {
//     id: faker.string.uuid(),
//     username: faker.internet.username(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
    
//   };
// }
// console.log(getRandomUser());

const connection =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'Delta_app',
  password:"Harshit@66"
});

// let q= "SHOW TABLES" ;
// try{
// connection.query(q, (err,result)=>{
//     if(err) throw err;
//     console.log(result);
//     console.log(result[0]);
//     console.log(result[1]);
//     console.log(result.length);
// });
// }catch(err){
//     console.log(err);
// }
// connection.end();

// let q= "INSERT INTO user (id , username , email , password) VALUES ?" ;
// // let  user=["123" , "123_newuser","abc@gmail.com","abc"];
// let  users=[["123b" , "123_newuserb","abc2@gmail.com","abcb"],["123c" , "123_newuserc","abc3@gmail.com","abcc"],];

// try{
// connection.query(q,[users], (err,result)=>{
//     if(err) throw err;
//     console.log(result);
// });
// }catch(err){
//     console.log(err);
// }
// connection.end();

//INSERT 100 users into user database using FAKER;

// let getRandomUser = () =>{
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password(),
    
//   ];
// };

// let data=[];
// for(let i=1;i<=100;i++){
//     data.push(getrandomUser());
// };

// console.log(data);

// let q= "INSERT INTO user(userId, username,email,password) VALUES ?";
// try{
//     connection.query(q,[data], (err,result) =>{
//         if (err) throw err;
//         console.log(result);
//     });
// }catch(err) {
//     console.log(err);
// }

// sql with backend express and rest api

const express= require("express");
const app=express();
const port =8080;
const path=require("path");
app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "/views"));
const methodOverride= require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


//home route
app.get("/" , (req, res) => {
    let q=" SELECT COUNT(*) FROM user";
    try{
        connection.query(q, (err,result) => {
            if (err) throw err;
            let count=result[0]["COUNT(*)"];
            res.render("home.ejs" , {count});
        });
    }catch(err) {
        console.log(err);
        res.send(" Some error occurred");
    }
    
});

//show user wala route

app.get("/user", (req, res) => {
    let q= `SELECT * FROM user`;
    try{
        connection.query(q, (err,users) => {
            if (err) throw err;
            let index=1;
            res.render("showusers.ejs", {users,index});
        });
    }catch(err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//edit route

app.get("/user/:id/edit", (req, res) => {
    let {id} = req.params;
    let q= `SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q , (err, result) => {
            if (err) throw err;
            console.log(result);
            let user= result[0];
            res.render("edit.ejs", {user});
        });
    }catch(err) {
        console.log(err);
        res.send("Some err in DB");
    };

});



//update route patch req
app.patch("/user/:id" , (req,res) => {
    let {id} = req.params;
    let {password : formPass , username : newUsername} = req.body;
    let q= `SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q , (err, result) => {
            if (err) throw err;
            let user= result[0];
            if(formPass != user.password){
                res.send("wrong password");
            }else{
                let q2= `UPDATE user SET username= '${newUsername}' WHERE id='${id}' `;
                connection.query(q2 , (err,result) => {
                    if (err) throw err;
                    res.redirect("/user");
                
                });
            }
            
        });
    }catch(err) {
        console.log(err);
        res.send("Some err in DB");
    };
});

//ADD USER to the database (iske liye phle ek form banana pdega usme hm details lenge phir backend mei bhej denge)

app.get("/user/new" , (req,res) => {
    res.render("newuser.ejs");
});

app.post("/user" , (req,res) => {
    let {id,username, email, password} = req.body;
    let data=[id,username, email,password];

    let q= `INSERT INTO user(id,username,email,password) VALUES(?,?,?,?)`;
    try{
        connection.query(q,data, (err,result) => {
            if (err) throw err;
            res.redirect("/user");
        });
    }catch(err){
        res.send("some err in db");
    }
    
});

//delete krne ke liye phle form create krenge then post request send krenge

app.get("/user/:id/delete", (req, res) => {
    let {id} = req.params;
    let q= `SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q , (err, result) => {
            if (err) throw err;
            console.log(result);
            let user= result[0];
            res.render("delete.ejs", {user});
        });
    }catch(err) {
        console.log(err);
        res.send("Some err in DB");
    };

});

//DELETE route for deleting user from database

app.delete("/user/:id" , (req,res) => {
    let {id} = req.params;
    let {email: Formemail ,password : FormPass} = req.body;
    let q= `SELECT * FROM user WHERE id='${id}'`;
    try{
    connection.query(q , (err, result) => {
        if (err) throw err;
        let user= result[0];
        if(FormPass != user.password || Formemail != user.email){
            res.send("WRONG CREDENTIALS");
        }else{
            let q2= `DELETE FROM user WHERE id='${id}'`;
            try{
            connection.query(q2, (err, result) => {
                if (err) throw err;
                res.redirect("/user");

            });
        }catch(err){
            res.send(" SOME ERR IN DB");
        }} });
    }catch(err){
        res.send("some err in db");
    }


    });

app.listen(port , (req,res) =>{
    console.log(`Server is listening to port ${port}`);
});