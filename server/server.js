var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

// CREATE
app.post('/todos', (req, res, next) => {
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text,
		completed: req.body.completed
	});

	todo.save().then((doc, e) => {
		if (e) {
			// Promise.reject();
			res.status(400).send(e);
		} else {
			// console.log("Here!");
			res.send(doc);
		}
	}, next)
})


 	var todo = new Todo({
		text: ""
	});

	todo.save().then((doc, e) => {
		if (e) {
			// Promise.reject();
			console.log(e);
		} else {
			// console.log("Here!");
			console.log('Saved!');
		}
	})


app.listen(8080, () => {
	console.log('Started on port 8080');
})


module.exports = {app};
//
//
// var a = new Todo({
// 	text: "example"
// 	// complete: false,
// 	// completedAt: new Date()
// })
//
// var a = new User({
// 	email: "skwaer@gmail.com "
// })
//
//
// a.save().then((doc, e) => {
// 	if (e) {
// 		console.log(e);
// 	}
// 	console.log('Saved todo', doc);
// });

// a.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (e) => {
// 	console.log(e);
// });
