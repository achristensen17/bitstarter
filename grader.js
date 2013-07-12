/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler'); //ALEXT

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var HTMLURL_DEFAULT = "";//ALEXT

//var HTMLURL_DEFAULT = "webtotest.html"; //ALEXT






var assertFileExists = function(infile) {//look for the fiel in the system
var instr = infile.toString();
    console.log("STRING "+instr);

  if(instr.match('http')){
    console.log("URL----- "+instr);
    rest.get(instr).on('complete', function(result) {
                  console.log("web Loaded ");
                    fs.writeFile("webtotest1.html", result, function (err) {
                      console.log('It is saved! ' +result);
                     
                    });
                    if(!fs.existsSync(instr)) {
                          console.log("%s does not exist. Exiting.", instr);
                          process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
                      }
                    return 'webtotest1.html';
                });

     console.log("web OUT ");
      return 'webtotest1.html';
  }
  else{
    console.log("FILE----- "+instr);
     if(!fs.existsSync(instr)) {
          console.log("%s does not exist. Exiting.", instr);
          process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
      }
      return instr;

  }
    
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <html_url>', 'URL to index.html', clone(assertFileExists))
        .parse(process.argv);

        console.log('ini file: '+program.file);
        console.log('ini url: '+program.url);
        console.log('ini cheks: '+program.checks);
  if(program.url){program.file=program.url;} //if url is definned, use it as
      console.log('new file: '+program.file);
      console.log('new url: '+program.url);
      console.log('new cheks: '+program.checks);

    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
