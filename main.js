const { dialog } = require('electron').remote
const $ = require('jquery');
const exec = require('child_process').exec;
const execSync = require("child_process").execSync;
var
  ls, path, errors = document.getElementById("errorList"),
  selectBtn = document.getElementById("select"),
  createBtn = document.getElementById("create"),
  saveBtn = document.getElementById("save"),
  destination = document.getElementById("path");

//console.log(dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']})[0]);

var contents = {
  "package name": "myapp",
  "version": "",
  "description": "",
  "entry point": "",
  "test command": "",
  "git repository": "",
  "keywords": "",
  "author": "",
  "license": "",
};

var packages = {
  "Async": "npm install async",
  "Browserify": "npm install browserify",
  "Bower": "npm install bower",
  "Backbone": "npm install backbone",
  "Csv": "npm install csv",
  "Debug": "npm install debug",
  "Express": "npm install express",
  "Electron": "npm install --verbose electron",
  "Forever": "npm install -g forever",
  "Grunt": "npm install grunt",
  "Gulp": "npm install gulp",
  "Hapi": "npm install hapi",
  "Http-server": "npm install -g http-server",
  "Inquirer": "npm install inquirer",
  "Jquery": "npm install jquery",
  "Jshint": "npm install -g jshint",
  "Koa": "npm install koa",
  "Lodash": "npm install lodash",
  "Less": "npm install less",
  "Moment": "npm install moment",
  "Mongoose": "npm install mongoose",
  "Npm": "npm install -g npm",
  "Nodemon": "npm install nodemon",
  "Nodemailer": "npm install nodemailer",
  "Optimist": "npm install optimist",
  "Phantomjs": "npm install phantomjs",
  "Passport": "npm install passport",
  "Q": "npm install q",
  "Request": "npm install request",
  "Socket.io": "npm install socket.io",
  "Sails": "npm install sails",
  "Through": "npm install through",
  "Underscore": "npm install underscore",
  "Validator": "npm install validator",
  "Winston": "npm install winston",
  "Ws": "npm install ws",
  "Zml2js": "npm install xml2js",
  "Yo": "npm install yo",
  "Zmq": "npm install zmq"
};

var install_packages = {};



$(document).ready(function () {
  // for (var key in packages)
  //   $("#packages").append("<li class='li-package' ><input name='" + key + "' type='checkbox' >" + key + "</input></li>");
  // $('#packages input').on("click", function () {
  //   saveBtn.disabled = false;
  // });

});


$("#form input").on("keydown", function () {
  saveBtn.disabled = false;
});



$('#packages input').on("click", function () {
  saveBtn.disabled = false;
});

$("#packages").text("No packages were selected.Search for packages.");


function saveSettings() {
  for (key in contents) {
    contents[key] = document.getElementById(key).value;
  };
  install_packages = {};
  $('#packages input:checked').each(function () {

    install_packages[$(this).attr('name')] = packages[$(this).attr('name')];

  });

  saveBtn.disabled = true;
}

function toggleConsole() {
  require('electron').remote.getCurrentWindow().webContents.toggleDevTools();
}

function selectFolder() {
  try {
    path = dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] })[0];
    destination.innerHTML = "Path : " + path;
    createBtn.disabled = false;

  } catch (error) {

  }


}

function createProject(e) {

  var flag;
  exec("IF EXIST package.json ECHO true", { cwd: path }, function (err, stdout, stderr) {

    flag = (stdout.indexOf("true") >= 0);
    if (!flag) {
      npm_init();
      installPackages();
      createFiles();
    }
    else
      delPackageJson();

  })
  //npm_init();
  //installPackages();
}



function npm_init() {

  createBtn.disabled = true;
  ls = exec("npm init", { cwd: path });

  ls.stdout.on('data', (data) => {

    var input = `${data}`.substr(0, `${data}`.indexOf(":"));
    //console.log(contents[input]);
    console.log(`${data}`);

    if (contents[input] != undefined) {
      ls.stdin.write(contents[input] + "\n");
    }
    else if (input != "")
      ls.stdin.write("\n");


  });


  ls.stderr.on('data', (data) => {
    // errors.innerHTML = "<li>" + `${data}` + "</li>";
    console.log(`stderr: ${data}`);
  });

  ls.on('exit', (code) => {

  });

}

function inputEnter(e){
  if(e.keyCode == 13){
    $("#search_btn").click();
  }
}

function search() {
  // $.get("https://ac.cnstrc.com/autocomplete/"+$("#search_inp").val()+"?autocomplete_key=CD06z4gVeqSXRiDL2ZNK",function(data){
  //   console.log(data);
  // })
  $("#search_btn")[0].disabled = true;
  $("#search_btn").text('Searching...');
  $("#search_list").html("");
  $.get("https://www.npmjs.com/search?q=" + $("#search_inp").val(), function (data) {
    // search finished
    $("#search_btn").text('Search');
    $("#search_btn")[0].disabled = false;
    var list = $(data).find('.packageName');
    list.each(function (index) {
      $("#search_list").append("<li class='package_item btn' >" + $(this).text() + "</li>");
    })
    $(".package_item").click(function () {
      if($("#packages").text()=="No packages were selected.Search for packages."){
        $("#packages").text("")
        $("#packages").append("<li class='li-package' ><input name='" + $(this).text() + "' type='checkbox' >" + $(this).text() + "</input></li>");
      }else{
      $("#packages").append("<li class='li-package' ><input name='" + $(this).text() + "' type='checkbox' >" + $(this).text() + "</input></li>");
      }
    });
  })

}

function installPackages() {
  createBtn.disabled = true;
  for (var key in install_packages) {
    var pack = exec("npm install " + key, { cwd: path }, function (err, stdout, stderr) {
      console.log(stdout);
    });
  }
}

function createFiles() {
  var comd = "echo.>" + contents["entry point"];
  exec(comd, { cwd: path }, function (err, stdout, stderr) {
    comd = "echo.>index.html";
    exec(comd, { cwd: path }, function (err, stdout, stderr) {
    })
  })
 
}




function delPackageJson() {
  alert("Couldn't perform the operation.Make sure the folder doesn't contain package.json file", "package.json conflict");
}
