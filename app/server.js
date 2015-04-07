/*Define dependencies*/

var path = require('path');
var multer = require("multer");
var express = require("express");
var app = express();
var done = false;

/*Configure the multer*/

app.use(multer({ dest: '/tmp/',
changeDest: function(dest, req, res) {
	var newDestination = dest + Date.now() + '/';
	var stat = null;
	var fs = require("fs");
	try {
		stat = fs.statSync(newDestination);
	} catch (err) {
		fs.mkdirSync(newDestination);
	}
	if (stat && !stat.isDirectory()) {
		throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
	}
	return newDestination
},
rename: function (fieldname, filename) {
	file = filename;
	return "body";
},
onFileUploadStart: function (file) {
	console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
	console.log(file.fieldname + ' uploaded to  ' + file.path)
	done = true;
}
}));

/*Zip and Download Zowi STL files*/

var download = function(name, path, res) {
        var sys = require('sys');
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) {
        	sys.puts(stdout);
        	res.download(path + "zowi-" + name + ".zip");
        	//exec("rm -rf " + path);
        }
        exec("zip -j " + path + "zowi-" + name + ".zip " + __dirname + "/../zowi/parts/*.stl " + path + "body.stl", puts);
}

/*Zowify the body*/

var zowify = function(file, res) {
	var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) {
		sys.puts(stdout);
		download(file.originalname.replace(".stl",""), file.path.replace("body.stl",""), res);
        }
	console.log("blender --background --python " + __dirname + "/../zowi/zowifier.py -- " + file.path + " " +__dirname + "/../zowi/hole.stl" + " " +__dirname + "/../zowi/shell.stl");
	exec("blender --background --python " + __dirname + "/../zowi/zowifier.py -- " + file.path + " " +__dirname + "/../zowi/hole.stl" + " " +__dirname + "/../zowi/shell.stl", puts);
}

/*Handling routes*/

app.get('/', function(req, res) {
      res.sendfile(path.resolve(__dirname + "/../public/index.html"));
});

app.post('/', function(req, res) {
	if(done == true) {
		zowify(req.files.userFile, res);
	}
});

/*Run the server*/

app.listen(3000, function() {
	console.log("Running on port 3000");
});
