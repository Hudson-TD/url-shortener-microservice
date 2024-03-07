require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const { redirect } = require('express/lib/response');

let counter = 1;
const db = [];

// Basic Configuration
const port = process.env.PORT || 3000;


app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  
  if (!urlRegex.test(req.body.url)) {
    return redirect.json({ error: 'invalid url' })
  }

  let original_url = req.body.url
  let short_url = counter;
  counter++;
  db.push({ original_url, short_url });
  console.log(db);
  res.json({ original_url, short_url });
})

app.get("/api/shorturl/:id", (req, res) => {
  let search = Number(req.params.id);

  for (let i = 0; i < db.length; i++) {
    if (db[i].short_url === search) {
      res.redirect(db[i].original_url)
    }
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
