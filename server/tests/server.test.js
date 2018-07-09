const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const {ObjectID} = require('mongodb');

const todos =[{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
 	text: 'Second test todo'
}]

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => {
		done();
	})
})

describe('GET /todos', () => {
	it('should list all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				// console.log(res.body.todos);
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	})
})

describe('POST /todos', () => {
	it ('should create a new todo', (done) => {
		var text = "Test todo text"

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done (err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e) );
			})

	})
	it('should not create todo with invalid body data', (done) => {
		var text ='';
		request(app)
			.post('/todos')
			.send({text})
			.expect(400)
			.expect((res) => {
				expect(res.body.text).toBe(undefined);
			})
			.end((err, res) => {
				if (err) {
					return done (err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					// expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e) );
			})
	})
})

describe('GET /todo/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		}).end(done);
	})

	it('should return 404 if todo not found', (done) => {
		var randomId = new ObjectID();

		request(app)
		.get(`/todos/${randomId}`)
		.expect(404)
		.end(done);

	})

	it('should return 404 for non-object', (done) => {
		request(app)
		.get('/todos/123')
		.expect(404)
		.end(done);


	})

})
