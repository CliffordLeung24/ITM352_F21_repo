//Copied from info server ex5 and part of lab 14
var fs = require('fs');
// require express
    var express = require('express');
//require express
    var app = express();
//require body parser
    var myParser = require("body-parser");
//require json file for user information
    var user_data_filename = "./user_data.json"; 
//require querystring
    var queryString = require("query-string") 
    const { stringify } = require('query-string');
//require data from products_data.js
    var products = require('./public/products_data.js'); 
    const {response} = require ('express');
const { getMaxListeners } = require('process');

//starts parser
    app.use(myParser.urlencoded({ extended: true }));

    var stringified
//Route to handle any request; also calls next
app.all('*', function (request, response, next) {
    console.log (request.method + ' to path ' + request.path);
    next();
});


//Keep values from POST
    var PermQuantities = {};

//processes the form
app.post("/process_form", function (request, response) {
    let POST = request.body;
    const objarray= Object.values(POST)
         console.log(POST)
//Use to recall this function in invoice      
    PermQuantities=POST 
//validation
    
//checks if quantities are defined in each textbox
//start with result being false
    var result= false 
    for(i = 0; i < objarray.length; i++)
    {   
            
// Check if it is non-negative
    var initialquantites= objarray[i]
    var totalquantities= totalquantities+initialquantites
    if(totalquantities != "undefined")
    {

// }
    //To Check if it is a posive number
    if(0>objarray[i])
    {
    return response.send(`<script>
        alert("Please enter a positive number"); 
        window.history.back();
                
         </script>`);
    }
     //To check if it is a whole number but code did not work so I did not include
     //if(parseInt(objarray[i]) != (objarray[i])){        
        //return response.send(`<script>
          //alert("Please enter a whole number"); 
           //window.history.back();
        // </script>`);
   // }
    //To Check if it is a valid number
    if(Number(objarray[i])!=objarray[i])
    {
    return response.send(`<script>
        alert("Please enter a valid number"); 
        window.history.back();
                    
        </script>`);
    }
   
    //if it ends true meaning if all the validation is right it goes redirects to invoice which calculates the invoice
    else
        {
        result=true
        }
    }
        }    
    var stringified = queryString.stringify(POST);
//if the results =true it would redirect to invoice but if it fails validation it pops up error and redirects to display page
    if(result==true){
        response.redirect("./login?"+ stringified)
    }
    else{
        alert("Enter valid quantity")
        response.redirect("./products_display.html?" + stringified)
        
    }
});


//to read user files, taken from lab 14 and modified
if (fs.existsSync(user_data_filename)) 
    {
    data = fs.readFileSync(user_data_filename, 'utf-8');
//parse the json file to convert into object/array
    user_data = JSON.parse(data);
    console.log("User_data=", user_data);
//to look at the size of the json file
    fileStats = fs.statSync(user_data_filename);
    console.log("File " + user_data_filename + " has " + fileStats.size + " characters");
    }    
//if the json file doesnt exist 
else{
    console.log(user_data_filename + "Wrong filename. Enter the right filename!");
    }

//Get request from login.view
app.get("/login", function (request, response){
    var loginview = fs.readFileSync("./public/login.view",'utf-8');
//loading the template
    response.send(eval('`' + loginview + '`'));

    
});
//taken form File I/O Lab and modified
//take the information from login page and post it to the login form
app.post("/loginform", function (request, response){
    console.log("got a post")
    POST = request.body;
    user_name = POST["username"];
    user_pass = POST["password"];
    console.log(POST)
    
   

//to verify a existing user and login
if(typeof user_data[user_name] != 'undefined'){
    if((user_data[user_name].password == user_pass)== true){
        console.log(user_name + " Logged in");
     
//if it is verified it would redirect to invoice with the quantities
    response.redirect("./invoice.html?" + stringified + queryString.stringify(POST) )
}   else{ 
    response.send(`<script>
        alert("Password entered is wrong"); 
        window.history.back();
        
        </script>`);
    }
}
        else{
            response.send(`<script>
                alert("Username entered is wrong"); 
                window.history.back();
                
            </script>`);
        }

});
//reads and writes the register.view / register page
app.get("/register", function (request, response) {
    var registerview = fs.readFileSync('./public/register.view', 'utf-8');
    response.send(eval('`' + registerview + '`'));
});
//taken from File/IO Lab and modified for registration
app.post("/registernew", function (request, response){
    console.log("got a new register")
    POST = request.body;
  
//getting the user info from the /register page and putting it into variables for validation. put username and email to lower case to prevent identical copies from forming
    var user_name = POST["username"].toLowerCase();
    var new_user_password = POST["password"];
    var new_user_password_rpt = POST["passwordrpt"];
    var new_user_email = POST["email"].toLowerCase();
    var new_user_fullname = POST["fullname"];
    console.log(POST)
    

 console.log(new_user_fullname)
    

if(typeof user_data[user_name] != 'undefined')
{
    response.send(`<script>
        alert("Username: ${user_name} exists please enter another username"); 
        window.history.back();
        
        </script>`);
    console.log("Username Exist")
    }else{ 
    UsernameExist = true
    }  
if(!validateUsername(user_name)){
    response.send(`<script>
    alert("Username: ${user_name} Needs to be no less than 5 characters and must exceed 15 characters"); 
    window.history.back();
    
    </script>`);
    }else{
    var validusername= true
}
if(!validatefullname(new_user_fullname)){
    response.send(`<script>
    alert("Fullname: ${new_user_fullname} Must between 0 and 30 characters following the prompt Last Name, First Name"); 
    window.history.back();
    
    </script>`);
    }else{
    var validfullname = true
}
if(!validateEmail(new_user_email)){
    response.send(`<script>
    alert("Email: ${new_user_email} Must follow the example jimmie@gmail.com or jimmie@hotmail.al"); 
    window.history.back();
    
    </script>`);
    }else{
    var validemail=true
}
if(new_user_password != new_user_password_rpt){
    response.send(`<script>
    alert("Passwords do not match please make sure and re-confirm that passwords match"); 
    window.history.back();
    </script>`);
    }else{
        var passwordmatch= true
}
console.log("REGISTRATION COMPLETE")
if(UsernameExist && validusername && validfullname && validemail &&passwordmatch){
    
    user_data[user_name] ={}
    user_data[user_name].fullname = POST["fullname"]
    user_data[user_name].email = POST["email"]
    user_data[user_name].password = POST["password"]
    user_data[user_name].passwordrpt = POST["passwordrpt"]

   
    data = JSON.stringify(user_data);
    fs.writeFileSync(user_data_filename, data, "utf-8");
    response.redirect("/login" +stringified)
    }else{
        response.redirect("/register" +stringified)
    }


        
    
});
//Validation functions taken from the Internet in order to validate username characters, full name characters, valid email.
function validateUsername(user) {
    const re = /^[a-zA-Z0-9]{5,15}$/;
    return re.test(String(user).toLowerCase());
}

function validatefullname(fullname){
    const re = /^[ +a-zA-Z,]{0,30}$/
    return re.test(String(fullname));
}

function validateEmail(email) {//used =@ and +\. to seperate sections of email
    const re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-z]{2,3}$/;
    return re.test(String(email).toLowerCase());
}




app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here