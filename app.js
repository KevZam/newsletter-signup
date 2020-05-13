const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// allows our css and images to be sent along with the html signup
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: firstName, LNAME: lastName },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  // example api key
  const url = "https://us18.api.mailchimp.com/3.0/lists/db0b920d16";
  const options = {
    method: "POST",
    auth: "kevan1:f954f907d68cd3a7230bf06799a91d8a-us18",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// changing port for heroku
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});

// API KEY f954f907d68cd3a7230bf06799a91d8a-us18

// List ID db0b920d16
