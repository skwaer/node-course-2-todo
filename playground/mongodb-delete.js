// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB');
	}
	console.log('Connected to MongDB server');
	const db = client.db('TodoApp');


	// db.collection('Todos').deleteMany({text: 'Thing'}).then((result) => {
	// 	console.log(result);
	// })

	// db.collection('Todos').deleteOne({text: 'Thing'}).then((result) => {
	// 	console.log(result.result);
	// })

	// db.collection('Todos').findOneAndDelete({text: 'Thing'}).then((result) => {
	// 	console.log(result.result);
	// 	console.log(result);
	// })

// ObjectID("5b414f738c923919a67318a4")
	db.collection('Users').deleteMany({name:'Paul'}).then((result) => {
		console.log(result.result);
		// console.log(result);
	})


	db.collection('Users').findOneAndDelete({_id:new ObjectID("5b414f738c923919a67318a4")}).then((result) => {
		console.log(result.result);
		 console.log(result);
	})

	// client.close();
});
