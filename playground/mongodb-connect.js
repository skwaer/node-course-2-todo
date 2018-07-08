// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB');
	}
	console.log('Connected to MongDB server');
	const db = client.db('TodoApp');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to use',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// })


// 	db.collection('Users').insertOne({
// 		name: 'Paul',
// 		age: 25
// 	}, (err, result) => {
// 		if (err) {
// 			return console.log('fukk');
// 		}
// 		console.log(JSON.stringify(result.ops, undefined, 2));
// //		console.log(result);
// 		console.log(result.ops[0]._id.getTimestamp());
// 	})
// 	console.log('Closing down');

	client.close();
});
