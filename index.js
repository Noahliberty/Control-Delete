const express = require("express"),
      app = express(),
      XMLHttpRequest = require('xhr2'),
	  bodyParser    = require("body-parser"),
      path 			= require("path");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// app.use answers all requests. Used here for testing connectivity.
// app.use((req, res) => {
//     console.log("New request!")
//     res.send("<h1>Record added! Thanks for signing up!</h1>")
//   });

app.get("/",(req, res) => {
    res.redirect("/home")
} )

app.get("/home", (req, res) => {
    res.render("main")
}) 

app.post("/formsubmit", (req, res) => {
    function formv3(){
    let data = {
        "fields": [
          {
            "name": "email",
            "value": req.body.email
          },
          {
            "name": "firstname",
            "value": req.body.firstName
          },
          {
            "name": "lastname",
            "value": req.body.lastName
          },
          {
            "name": "platform",
            "value": req.body.platform
          }
        ]
    }
  
    var xhr = new XMLHttpRequest();
    var url = 'https://api.hsforms.com/submissions/v3/integration/submit/25304197/48da8a52-ea69-49fc-b8fd-1ec9435c51f9'
    var final_data = JSON.stringify(data)

    xhr.open('POST', url);
    // Sets the value of the 'Content-Type' HTTP request headers to 'application/json'
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) { 
            res.render("success"); // Render Succeses Page. Potentially pass through inpuits to confirm. 
        } else if (xhr.readyState == 4 && xhr.status == 400){ 
            res.render("error"); // Returns a 400 error the submission is rejected.          
        } else if (xhr.readyState == 4 && xhr.status == 403){ 
            res.render("error"); // Returns a 403 error if the portal isn't allowed to post submissions.           
        } else if (xhr.readyState == 4 && xhr.status == 404){ 
            res.render("error"); //Returns a 404 error if the formGuid isn't found     
        }
       }


    // Sends the request 
    
    xhr.send(final_data)
 }
 formv3()
});


// Start Server listinging for Http requests
app.listen(process.env.PORT || 3000, () => {
    console.log("Listening!")
});