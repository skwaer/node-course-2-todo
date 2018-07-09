const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');
const {User} = require ('./../server/models/user');

const {ObjectID} = require('mongodb');


var id = "5b42c88774eea22ac0f8fc9c";
// var id = "6b42c88774eea22ac0f8fc9c";
var userId = "5b416db17bc94b1f06a4884b";
var userId = "5b416db17bc94b1f06a4884cc";

if (!ObjectID.isValid(id)) {
	console.log('ID not valid');
}

// user not found
// user was found
// handle errors

User.findById(userId).then((user) => {
	if (!user)
		return console.log('Id not found');
	console.log(user);
})
.catch((e) => console.log('Error'));

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log(todos);
// })
//
// Todo.findOne({
// 	_id: id
// }).then((todos) => {
// 		console.log(todos);
// })
//
// Todo.findById(id).then((todos) => {
// 	if (!todos) {
// 		return console.log('Id not found');
// 	}
// 	console.log(todos);
// })
// .catch((e) => console.log(e));
