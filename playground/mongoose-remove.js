const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');
const {User} = require ('./../server/models/user');

const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result) => {
// 	console.log('Removed everything');
// 	console.log(result);
// 	console.log(JSON.stringify(result, undefined, 2));
//
// })

var id = "5b4381fb74b7db38edd83065";

// Todo.findOneAndRemove()
Todo.findByIdAndRemove(id).then((result) => {
	console.log(result);
})
