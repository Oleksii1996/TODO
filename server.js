const http = require('http');
const fs = require('fs');
const path = require('path');

const types = {
	'.js': {
		contentType: 'text/javascript'
	},
	'.css': {
		contentType: 'text/css'
	},
	'.html': {
		contentType: 'text/html'
	},
	'.jpg': {
		contentType: 'image/jpeg'
	},
	'.png': {
		contentType: 'image/png'
	},
	'default': {
		contentType: 'text/html'
	}
};

const server = http.createServer();

server.on('request', (req, res) => {

	if (req.method === 'POST') {
		let postData = '';
		req.on('data', data => {
			postData += data;
		});

		req.on('end', () => {
			processPost(req, res, postData);
		});
	} else {
		if (req.url === '/results') {
			getResults(req, res);
		} else {
			processGet(req, res);
		}
	}
});

function getResults(req, res) {
	res.setHeader('Content-Type', 'application/json');
	getTop10data((err, data) => {
		if (err) {
			res.statusCode = 500;
		} else {
			res.statusCode = 201;
			res.write(data);
		}
		res.end();
	});
}

function getTop10data(done) {
	fs.readFile('results.json', (err, data) => {
		if (err) {
			return done(err);
		}
		data = JSON.parse(data).slice(0, 10);
		done(null, JSON.stringify(data));
	});
}

function processPost(req, res, postData) {
	let data = {};
	try {
		data = JSON.parse(postData);
		
		
		fs.readFile('results.json', (err, dataJSON) => {
			if (err) {
				res.statusCode = 500;
			}
			let arr = JSON.parse(dataJSON);
			arr.push(data);
			fs.writeFile('results.json', JSON.stringify(arr.sort((a, b) => b.points - a.points)), (err) => {
  				if (err) {
  					res.statusCode = 500;
  				} else {
  					res.statusCode = 201;
  				}
			});
		});
	} catch (e) {
		res.statusCode = 400;
	}	
	res.end();
}

function processGet(req, res) {
	fs.exists('./public' + req.url, exists => {
		if (!exists) {
			res.statusCode = 404;
			res.write('404 Not Found');
			res.end();
		}
	});

	let filePath = req.url;
	if (req.url === '/') {
		filePath = '/index.html';
	}

	let fileExt = path.extname(filePath);
	let responseParams = types[fileExt] || types.default;
	res.setHeader('Content-Type', responseParams.contentType);

	fs.readFile('./public' + filePath, (err, data) => {
    	if (!err) {
    		res.statusCode = 200;
    		res.write(data);
    	} else {
    		res.statusCode = 500;
    	}
    	res.end();
    });
};

server.listen(80, () => {
	console.log('Server is up and running!');
});