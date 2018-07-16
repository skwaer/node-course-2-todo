const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const salt = '123';

const users = [{
		_id: userOneId,
		email: 'skwaer@example.com',
		password: 'user.one.pass',
		tokens: [{
			access: 'auth',
			token: jwt.sign({_id: userOneId, access: 'auth'}, salt).toString()
		}]
	}, {
		_id: userTwoId,
		email: 'skwaerb@example.com',
		password: 'user.two.pass',
		tokens: [{
			access: 'auth',
			token: jwt.sign({_id: userTwoId, access: 'auth'}, salt).toString()
		}]
	}]

const todos =[{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
}, {
	_id: new ObjectID(),
 	text: 'Second test todo',
	completed: true,
	completedAt: 333,
	_creator: userTwoId
}]

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => {
		done();
	})
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() =>  done() )
};

module.exports = {todos, populateTodos, users, populateUsers};
