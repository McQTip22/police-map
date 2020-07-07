var express = require('express'),
	app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile('/views/index.html', { root: __dirname });
});

app.listen(process.env.PORT || 3000, function() {
	console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});
