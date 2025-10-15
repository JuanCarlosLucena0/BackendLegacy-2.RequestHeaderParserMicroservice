// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// si tu app corre detrás de un proxy (Render, Heroku, etc.), activar trust proxy
// para que req.ip use X-Forwarded-For correctamente
app.set('trust proxy', true);

app.get('/api/whoami', function (req, res) {
  // 1) Obtener la IP: intentar X-Forwarded-For, luego req.ip
  // X-Forwarded-For puede traer lista: "a, b, c", tomamos la primera
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || '';
  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  // A veces Node devuelve IPv6 con prefijo ::ffff:IPv4
  if (typeof ip === 'string' && ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  // 2) Idioma preferido — header Accept-Language (tomamos el primer valor)
  const langHeader = req.headers['accept-language'] || '';
  const language = langHeader.split(',')[0] || '';

  // 3) Software — User-Agent header (puedes pasar todo el string)
  const software = req.headers['user-agent'] || '';

  res.json({
    ipaddress: ip,
    language: language,
    software: software
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
