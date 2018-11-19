var fs = require('fs');
var Regex = require("regex");
var http = require('http');

var knexmssql = require('knex')({
  client: 'mssql',
  connection: {
    server     : '192.168.7.210',
    port: '1433',
    user     : '',
    password : '',
    database : 'CrawlingStats'
  }  
});

var stream = fs.createWriteStream("output_request.txt");
stream.write("Siteid\t\t\t\t\t\tposts\r\n");
//stream.once('open', function(fd) {
    //stream.end();
//});
  
function getData (http, url, iter, sqlData) {
	var requestedData;
	http.get(url, function (response) {
        console.log('URL: ' + url);
		console.log("Got response: " + response.statusCode);
		if(response.statusCode === 200) {
			console.log("Got value: " + response.statusMessage);			
			response.setEncoding('utf8');
            var body = '';
            var iteration = 0;
			response.on('data', function (chunk) {                                
                body += chunk;
			});
            response.on('end', function () {
                console.log(sqlData);
                let posts = String(body.match(/<TotalFound>.+<\/TotalFound>/i)).match(/\d+/i);                
                console.log('Posts ' + posts);
                stream.write(sqlData.siteid + '\t\t\t\t\t' + posts + "\r\n");
				console.log('Response ended');
                console.log(iter + ' ============================================================================================================ ' + iter);                
				return requestedData;
			});
		}
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

var timeout = 0;

knexmssql.raw(`SELECT siteid,
siteurl,
ts.bbstype,
cgipath,
needlogin,
agentname,
fetchdelay,
timeoutvalue,
useproxy,
ts.dateadded,
dateupdated,
lastcrawl,
forumcount,
ts.active,
donotcrawl
FROM testsites ts, bbstypes as bbs
where ts.bbstype = bbs.bbstype and ts.active = 1 and ts.donotcrawl = 0 and bbs.singleforum = 0;`).then(function (response) {
    knexmssql.destroy();
    for(let i in response) {
        (function (ind) {
        setTimeout(function(url) {
            url = `http://api.boardreader.com/v1/Boards/Posts?key=e97cd399d54887bbeff915552b7a06b7&mode=full&sort_mode=time_desc&filter_date_from=0&limit=1&filter_inserted_from=1484636228&filter_site_key=` + response[ind].siteid;
            //url = `http://api.boardreader.com/v1/Boards/Posts?key=e97cd399d54887bbeff915552b7a06b7&mode=full&sort_mode=time_desc&filter_date_from=0&limit=1&filter_inserted_from=1484636228&filter_site_key=54eecc3a14`;
            getData (http, url, ind, response[ind]);
        }, timeout );})(i);
        timeout += 500;
        i++;
    }
});