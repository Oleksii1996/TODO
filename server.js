const http = require('http');
const fs = require('fs');

const server = http.createServer();

server.on('request', (req, res) => {

	fs.exists('./public' + req.url, exists => {
		if (!exists) {
			res.statusCode = 404;
			res.write('404 Not Found');
			res.end();
		}
	});

	let extension = req.url.split('.')[req.url.split('.').length-1],
		filePath;

	switch (extension) {
		case 'html':
			res.setHeader('Content-Type', 'text/html');
			break;
		case 'css':
			res.setHeader('Content-Type', 'text/css');
			break;
		case 'js':
			res.setHeader('Content-Type', 'text/javascript');
			break;
		case 'jpg':
			res.setHeader('Content-Type', 'image/jpeg');
			break;
		default:
			res.setHeader('Content-Type', 'text/html');
			filePath = './public/index.html';
			break;
	}

	if (filePath === undefined) {
		filePath = './public' + req.url;
	}

	fs.readFile(filePath, (err, data) => {
    	if (!err) {
    		res.statusCode = 200;
    		res.write(data);
    	} else {
    		res.statusCode = 500;
    	}
    	res.end();
    });
});

server.listen(80, () => {
	console.log('Server is up and running!');
});