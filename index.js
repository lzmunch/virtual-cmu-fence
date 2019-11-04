var express = require('express'),
    path = require('path'),
    formidable = require('formidable'),
    app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static('public'));

// assume called from import.html
app.get('/', function (req, res){
    res.sendFile(__dirname + '/public/import.html');
});

// assume called from import.html
app.post('/', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
//        file.path = __dirname + '/uploads/' + file.name; 
        file.path = __dirname + '/public/assets/uploads/' + "tex_image.jpg"; 
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/public/import.html');
});

app.listen(app.get('port'), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Running on port: ' + app.get('port')); }
});
