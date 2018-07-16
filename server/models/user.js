const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const seedSecret = process.env.JWT_SECRET;

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type:String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]


});

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = 'auth';
	// var salt = '123'

	var token = jwt.sign({_id: user._id.toHexString(), access}, seedSecret).toString();
	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	})

}

UserSchema.methods.removeToken = function(token) {
	var user = this;

	return user.update({
		$pull: {
			tokens: {token}
			}
	})
}


UserSchema.statics.findByToken = function (token) {
	var User = this;
	// var salt = '123';
	var decoded;

	try {
		decoded = jwt.verify(token, seedSecret);
	} catch (e) {
		// return new Promise((resolve, reject) => {
		// 	reject();
		// })
		return Promise.reject('test');
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})

	// console.log(decoded);
	// User.findById(decoded._id).then((user) => {
	// 	if (!user)
	// 		return console.log('User Id not found');
	//
	// 	return user;
	// })
	// .catch((e) => {
	// 	console.log(e);
	// })
};

UserSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		// update this for bcrypt with promises!
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			})
		})

	})
};


UserSchema.pre('save', function(next) {
	var user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			})
		})
	} else {
		next();
	}

})


// var decoded = jwt.verify(token, secret);


var User = mongoose.model('User', UserSchema);
	// email: {
	// 	type: String,
	// 	required: true,
	// 	trim: true,
	// 	minlength: 1,
	// 	unique: true,
	// 	validate: {
	// 		validator: validator.isEmail,
	// 		message: '{VALUE} is not a valid email'
	// 	}
	// },
	// password: {
	// 	type:String,
	// 	required: true,
	// 	minlength: 6
	// },
	// tokens: [{
	// 	access: {
	// 		type: String,
	// 		required: true
	// 	},
	// 	token: {
	// 		type: String,
	// 		required: true
	// 	}
	// }]
// })

module.exports = {User};
