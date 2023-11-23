const fs = require('fs');

function readme(logger){
	fs.readFile("./README.txt", 'utf8', function (err, data) {
	if (err) {
		return logger.warn(err);
	}
	logger.info(data);
	});
}

module.exports = readme;