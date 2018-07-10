const config = require('./config/config');

const port = process.env.PORT || 8080;

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const {ObjectID} = require('mongodb');


var app = express();
// const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// CREATE
app.post('/todos', (req, res, next) => {
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text,
		completed: req.body.completed
	});

	todo.save().then((doc) => {
		res.send(doc);
		}, (e) => {
			res.status(400).send(e);
		});
	});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	})
})

// GET ONE TODO
app.get('/todos/:todoId', (req, res) => {
	// res.send(req.params);
	var todoId = req.params.todoId;

	// check isValid
		// send 404
	if (!ObjectID.isValid(todoId)) {
		// console.log('ID not valid');
		res.status(404).send('ID not valid');
		return;
	}

	Todo.findById(todoId).then((todo) => {
		if (todo)
			res.send({todo});
		else {
			res.status(404).send('ID not found');
		}

	}, (e) => {
		res.status(400).send(e);
	})

})

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(404).send('ID not valid');
		return;
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (todo)
			res.send({todo});
		else {
			res.status(404).send('ID not found and not deleted');
		}
	}, (e) => {
		res.status(400).send(e);
	})
})

app.patch('/todos/:id', (req,res) => {
	var id = req.params.id;
	// console.log(req.body);
	var body = _.pick(req.body, ['text', 'completed']);
	// console.log(body);
	// body.completed = (body.completed == 'true');
	// console.log(body);
	// if(_.isBoolean(body.completed))
	// 	console.log('Is boolean!');

	if (!ObjectID.isValid(id)) {
		res.status(404).send('ID not valid');
		return;
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
		.then((todo) => {
		if (todo) {
			// console.log("Hi!");
			res.send({todo});
		}
		else {
			res.status(404).send('ID not found and not updated');
		}
	}, (e) => {
			res.status(400).send(e);
	})
})


app.listen(port, () => {
	console.log(`Started on port ${port}`);
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
