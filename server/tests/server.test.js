const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos =[{
	text: 'First test todo'
}, {
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
				console.log(res.body.todos);
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
			// .end((err, res) => {
			// 	if(err) {
			// 		return done(err);
			// 	}
			// })
			// .catch((e) => done(e));
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
		// done();
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

// console.log(process._getActiveRequests());
// console.log(process._getActiveHandles());
