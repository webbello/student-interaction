var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Story = require('../models/story');

var config = require('../config');
var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');
function createToken(user) {
 	var token = jsonwebtoken.sign({
 		id: user._id,
 		name: user.name,
 		username: user.username
 	}, secretKey, {
 		expiresIn: 1440
 	});
 	return token;
}


/* GET users listing. */
router.get('/', function(req, res, next) {
	User.find((err, users) => {
		if (err) {
			console.log(err);

		} else {
			res.json(users);
		}
	});
	//res.json({message: 'All users'})
  
});

/* Signup. */
router.post('/signup', function(req, res, next) {
	var user = new User({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password
	});
	user.save(function (err) {
		if (err) { res.send(err);
			return;
		}
		res.json({message: 'User has been added successfully!'})

	});
  
});

router.route('/login').post((req, res) => {
    User.findOne({username: req.body.username}).select('password').exec(function (err, user) {
    	if (err) throw err;
    	if (!user) {
    		res.send({message: 'User Doesnt exit'});
    	} else if (user) {
    		var validPassword = user.comparePassword(req.body.password);
    		if (!validPassword) {
    			res.json({message: 'Invalid password'});
    		} else {
    			var token = createToken(user);
    			res.json({
    				success: true,
    				message: 'Successfully Login!',
    				token: token
    			})
    		}
    	}
    });
});

// Middelware to check login user
router.use(function (req, res, next) {
	console.log('Somebody just came to our app');
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	if (token) {
		 jsonwebtoken.verify(token, secretKey, function (err, decoded) {

		 	if (err) {
		 		res.status(403).send({success: false, message: 'failed to authenticate user'});
		 	} else {
		 		req.decoded = decoded;
		 		next();
		 	}
		 });
	} else {
		res.status(403).send({success: false, message: 'No Token Provided'});
	}
});

/* Add User. */
router.post('/add', function(req, res, next) {
	var user = new User({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password
	});
	user.save(function (err) {
		if (err) { res.send(err);
			return;
		}
		res.json({message: 'User has been added successfully!'})

	});
  
});

router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (!user)
            return next(new Error('Could not load document'));
        else {
            user.title = req.body.title;
            user.responsible = req.body.responsible;
            user.description = req.body.description;
            user.severity = req.body.severity;
            user.status = req.body.status;

            user.save().then(user => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/delete/:id').get((req, res) => {
    User.findByIdAndRemove({_id: req.params.id}, (err, quiz) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    })
});


router.route('/story')
	.post(function (req, res) {
		story = new Story({
			creator: req.decoded.id,
			content: req.body.content
		});
		story.save(function (err) {
			if (err) {
				res.send(err);
				return;
			}
			res.json({message: 'New Story Created'});
		});
	})

	.get(function (req, res) {
		Story.find({creator: req.decoded.id}, function (err, stories) {
			if (err) {
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});

router.get('/me', function(req, res, next) {

	res.json(req.decoded);
  
});



module.exports = router;
