// Creeate web server

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var comments = [];
var server = http.createServer(function (req, res) {
    var url_parts = url.parse(req.url);
    if (url_parts.pathname == '/') {
        fs.readFile('./comments.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }
    else if (url_parts.pathname == '/comment') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                req.connection.destroy();
            }
        });
        req.on('end', function () {
            var post = qs.parse(body);
            comments.push(post.comment);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Thanks for your comment\n');
        });
    }
    else if (url_parts.pathname == '/getComments') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(comments));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found\n');
    }
});
server.listen(8080);
console.log('Server is listening on port 8080');