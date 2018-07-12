const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('DELETE /todo:/id', () => {
	it('should delete a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				// done();
				// query database using findById//
				//expect(null).toNotExist
				Todo.findById(hexId).then((todo) => {
					expect(todo).toBeFalsy(	);
					done();
				}).catch((e) => done(e));


			})
	})
	it('should return 404 if todo not found',(done) => {
		var randomId = new ObjectID();

		request(app)
		.delete(`/todos/${randomId}`)
		.expect(404)
		.end(done);
	})
	it('should return 404 if object id is invalid', (done) => {
		request(app)
		.get('/todos/123')
		.expect(404)
		.end(done);
	})
})

describe('PATCH /todo:/id', () => {
	it('should update from false to true', (done) => {
		var id = todos[0]._id;
		var text = "test;"
		var changes = {
			text: text,
			completed: true
		}

		// grab id of first item
		request(app)
		.patch('/todos/' +id)
		.send(changes)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(typeof res.body.todo.completedAt).toBe('number');
		})
		.end((err, res) => {
			if (err)
				return done(err);

			Todo.findById(id).then((todo) => {
				expect(todo.text).toBe(text);
			})
			done();

		})

	})
	it('should clear completedAt when todo is not completed', (done) => {
		var id = todos[1]._id;
		var text = "test;"
		var changes = {
			text: text,
			completed: false
		}
		request(app)
		.patch('/todos/' +id)
		.send(changes)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toBeFalsy();
		}).end(done);


	})


})

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		// set headers
		// users[0].tokens
		// console.log(users[0]);
		// console.log(users[0].tokens.token);
		// console.log(users[0].tokens[0].token);
		// console.log('-----');
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			// console.log(body);
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		}).end(done);
	})


	it('should return 401 if not authetnicated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', 'badtokenstring')
		.expect(401)
		// .expect((res) => {
		//  	console.log(body);
		// 	expect(res.body).toEqual()
		//  	expect(res.body._id).tobe(users[0]._id.toHexString());
		// 	expect(res.body.email).tobe(users[0].email);
		.end(done);
	})
})

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'a@a.com';
		var password = 'password';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if (err) { return done(err) };

				User.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				})
			})

	})
	it('should return validation errors if rqeuest invalid', (done) => {
		var email = '@a.com';
		var password = 'password';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			// .expect((res) => {
			// 	console.log(res.body);
			// })
			.end(done);

	})
	it('should not create user if email in use', (done) => {
		var email = users[0].email;
		var password = 'password';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			// .expect((res) => {
			// 	console.log(res);
			// })
			.end(done);
	})

})

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		email = users[1].email;
		password = users[1].password

		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(200)
			// .end(done)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
			// }).end(done);
			})
			.end((err, res) => {
				if (err)
					return done(err);

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e) => done(e));

			})

	})
	it('should reject invalid login', (done) => {
		email = users[1].email;
		password = 'incorret password';

		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if (err)
					return done(err);

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0].token.length).toBe(0);
					done();
				}).catch((e) => done(e));

			})



		done();
	})

})
