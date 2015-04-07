/*Define dependencies.*/

var multer = require("multer");
var express = require("express");
var app = express();
var done=false;

/*Configure the multer.*/

app.use(multer({ dest: '/tmp/',
changeDest: function(dest, req, res) {
  var newDestination=dest+Date.now()+'/';
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
   file=filename;
   return "body";
},
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

/*Zip STL files.*/
var zipSTL = function(name, path, res) {
	console.log("Zip STL files...");
        var sys = require('sys');
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) {
          sys.puts(stdout);
          res.download(path+"zowi-"+name+".zip");
          exec("rm -rf "+path);
        }
        exec("zip -j "+path+"zowi-"+name+".zip ./zowi/parts/*.stl "+path+"body.stl", puts);
}

/*Mesh diff function.*/
var meshDiff = function(file,res) {
	console.log("Starting mesh difference...");
	var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr){
          sys.puts(stdout);
	  zipSTL(file.originalname.replace(".stl",""), file.path.replace("body.stl",""), res);
        }
	exec("blender --background --python ./diff.py "+file.path, puts);
}

/*Handling routes.*/

app.get('/',function(req,res){
      res.sendfile("index.html");
});

app.post('/',function(req,res){
  if(done==true){
    meshDiff(req.files.userFile,res);
  }
});

/*Run the server.*/
app.listen(3000,function(){
    console.log("Working on port 3000");
});
