const config = require('./config/config');

const port = process.env.PORT || 8080;

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const {ObjectID} = require('mongodb');


var app = express();
// const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// CREATE
app.post('/todos', authenticate, (req, res) => {
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
		// completed: req.body.completed
	});

	todo.save().then((doc) => {
		res.send(doc);
		}, (e) => {
			res.status(400).send(e);
	});
});

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	})
})

// GET ONE TODO
app.get('/todos/:todoId', authenticate, (req, res) => {
	// res.send(req.params);
	var todoId = req.params.todoId;

	// check isValid
		// send 404
	if (!ObjectID.isValid(todoId)) {
		// console.log('ID not valid');
		res.status(404).send('ID not valid');
		return;
	}

	Todo.findOne({
		_creator: req.user._id,
		_id: todoId
	}).then((todo) => {
		if (todo)
			res.send({todo});
		else {
			res.status(404).send('ID not found');
		}

	}, (e) => {
		res.status(400).send(e);
	})

})

app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(404).send('ID not valid');
		return;
	}

	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (todo)
			res.send({todo});
		else {
			res.status(404).send('ID not found and not deleted');
		}
	}, (e) => {
		res.status(400).send(e);
	})
})

app.patch('/todos/:id', authenticate, (req,res) => {
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

	//find One and update
	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
			}, {$set: body}, {new: true})
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


app.post('/users', (req,res) => {
	// console.log(req.body);
	// var body = _.pick(req.body, ['email', 'password', 'tokens']);
	var body = _.pick(req.body, ['email', 'password']);

	// var user = {
	// 	email: 'skwaer@gmail.com',
	// 	password: 'abcd1234',
	// 	tokens: {
	// 		access: 'Access',
	// 		token: 'truetdat'
	// 	}
	// }

	// console.log(req.body);
	var user = new User(body);


	user.save().then(() => {
		// console.log('here 1');
		return user.generateAuthToken();
		// res.send(doc);
	}).then((token) => {
		// console.log(token);
		res.header('x-auth', token).send(user);
		// console.log('here 2');

	}).catch((e) => {
			res.status(400).send(e);
	})
})

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
})

app.post('/users/login', (req,res) => {
	// var body = _.pick(req.body, ['email', 'password']);
	var email = req.body.email;
	var password = req.body.password;
	// console.log(password);

	User.findByCredentials(email, password).then((user) => {
		user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		})
	}).catch((e) => {
		res.status(400).send();
	});


	// set auth tokens
	// send headers
})

app.delete('/users/me/token', authenticate, (req, res) => {

	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	})
});


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
