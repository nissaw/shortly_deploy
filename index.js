var app = require('./server.js');

app.set('port', (process.env.PORT || 4568));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});