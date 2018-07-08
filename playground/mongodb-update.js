// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB');
	}
	console.log('Connected to MongDB server');
	const db = client.db('TodoApp');

	db.collection('Users').findOneAndUpdate({
		// _id: new ObjectID("5b4164f3b892eec131abec2f")
		name: "Jen"
	}, {
		$set: {
			completed: false
		},
		$inc: {
			age: 1,
			dob: 1
		}
	}, {
		returnOriginal: false
	}
	).then((result) => {
		console.log(result);
	})


	// db.collection('Todos').findOneAndUpdate(
	// 	{text: "Pet the cat"},
	// 	{completed:true}
	// ).then((result) => {
	// 	console.log(result.result);
	// })


	// client.close();
});
