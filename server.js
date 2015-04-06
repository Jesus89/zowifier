/*Define dependencies.*/

var express = require("express");
var multer = require("multer");
var app = express();
var done=false;
var file='';

/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    file=filename 
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

/*Mesh diff function.*/
var meshDiff = function(res) {
	console.log("Starting mesh difference...");
	var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { sys.puts(stdout); res.sendfile("download.html"); } 
	exec("blender --background --python ./diff.py", puts);
}

/*Zip STL files.*/
var zipSTL = function(res) {
	console.log("Zip STL files...");
        var sys = require('sys');
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) { sys.puts(stdout); res.download("./uploads/zowi-"+file+".zip"); }
        exec("zip -j ./uploads/zowi-"+file+".zip ./zowi/parts/*.stl ./uploads/*.stl", puts);
}

/*Handling routes.*/

app.get('/',function(req,res){
      res.sendfile("index.html");
});

app.post('/',function(req,res){
  if(done==true){
    meshDiff(res);
  }
});

app.post('/zowi',function(req,res){
  console.log("Download");
  zipSTL(res);
});

/*Run the server.*/
app.listen(3000,function(){
    console.log("Working on port 3000");
});
