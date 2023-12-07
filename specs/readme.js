const fs = require('fs');
const spec1 = require("./spec1");
function readme(logger){
	fs.readFile("./README.md", 'utf8', function (err, data) {
	if (err) {
		return logger.warn(err);
	}
	logger.info(data);
	});
}

module.exports = readme;