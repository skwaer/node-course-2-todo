const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = 'abcd123';
bcrypt.genSalt(10, (err, salt) => {
		console.log('---');
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	})
});

var hashedPassword = '$2a$10$38.7VJVKXJLERYyAJhfKnea/NQbQV9UuqM/JUP/T3zh4MCwePBPIe';
bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
})

console.log("-------");


var data = {
	id: 4
}
var secret = '123'
var token = jwt.sign(data, secret);
// console.log(token);
var decoded = jwt.verify(token, secret);
// console.log(decoded);

// var message = "I am user 4";
// var hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);
//
// var data = {
// 	id: 4
// }
//
// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// console.log(resultHash);
// console.log(token.hash);
