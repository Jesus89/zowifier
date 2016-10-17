/*
 * This file is part of the Zowifier project
 *
 *  License: GPL v3
 *  Date: April 2015
 *  Author: Jesús Arroyo Torrens <jesus.arroyo@bq.com>
 *
 */

var fs = require('fs');
    open = require('open');
    express = require('express');
    multer  = require('multer');
    exec = require('child_process').exec;

var app = express();
    upload = multer({ dest: 'uploads/' });

// Configure the application
app.use(express.static('public'));

// Handle routes
app.get('/', function (req, res) {
  res.sendFile('public/index.html');
});

app.post('/upload', upload.single('userFile'), function(req, res) {
  console.log('> Upload ' + req.file.originalname + ' file');
	zowify(req.file, res);
});

/// Zowify the body
var zowify = function(file, res) {
  var name = file.originalname.replace('.stl', '');
  var holePath = 'zowi/hole.stl';
  var shellPath = 'zowi/shell.stl';
  var zowifierPath = 'zowi/zowifier.py -- ' + file.path;
  var blenderCommand = 'blender/blender --background --python ' + [zowifierPath, holePath, shellPath].join(' ');

  // Blender
	exec(blenderCommand, function (error, stdout, stderr) {
    var zipCommand = 'zip -j uploads/zowi-' + name + '.zip ' + 'zowi/parts/*.stl uploads/body.stl';
    // Zip
    exec(zipCommand, function (error, stdout, stderr) {
      // Download zip
      console.log('> Download zowi-'+ name + '.zip')
      res.download('uploads/zowi-'+ name + '.zip');
      // Remove files
      fs.unlinkSync('uploads/body.stl');
      fs.unlinkSync(file.path);
    });
  });
}

// Run the server
var server = app.listen(8080, function () {
  console.log('Example app listening on port 8080!\n');
  open('http://localhost:8080');
});
