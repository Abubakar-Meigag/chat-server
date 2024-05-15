process.env.PORT = process.env.PORT || 9090;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// const welcomeMessage = {};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.

const messages = [];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

// show all
app.get("/messages", function (req, res) {
  res.send(messages);
});

// find by id
app.get("/messages/:id", (req, res) => {
  const getById = Number(req.params.id);
  const findByID = messages.find((message) => message.id === getById);
  if (!findByID)
    return res.status(404).json("messages with the ID given was not found");
  res.json(findByID);
});

// create new
app.post("/messages/create", (req, res) => {
  if (!req.body.name || req.body.name.length < 3 || req.body.text === "")
    return res
      .status(400)
      .json(
        "Name is required & should be at less 3 characters & should have to write message"
      );
  
  let date_time = new Date();
  let date = ("0" + date_time.getDate()).slice(-2);
  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
  let year = date_time.getFullYear();
  let hours = date_time.getHours();
  let minutes = date_time.getMinutes();
  let seconds = date_time.getSeconds();

  const newMessages = {
    id: messages.length,
    from: req.body.name,
    text: req.body.text,
    timeSent: (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
  };

  messages.push(newMessages);
  res.json(messages);
});

// delete by id
app.delete("/messages/delete/:id", (req, res) => {
  const getById = Number(req.params.id);
  const findByID = messages.find((message) => message.id === getById);
  const index = messages.indexOf(findByID);
  
  if (!findByID)
    return res.status(404).json("message with the ID given was not found");

  messages.splice(index, 1);
  res.json("message with the ID has been deleted");
});

//search
app.get("/search/by/message", (req, res) => {
  const message = req.query.text;
  
    if (message.length < 0) {
      return res
        .status(400)
        .json("Please provide a 'text' parameter for search.");
    }

    const searchResult = messages.filter((text) =>
      text.text.toLowerCase().includes(message.toLowerCase())
    );
  res.status(200).json(searchResult);
});



app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}...`);
});