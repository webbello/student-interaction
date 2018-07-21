var express = require('express');
var router = express.Router();

var User = require('../models/user');
var config = require('../config');
var secretKey = config.secretKey;

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
/* GET users listing. */
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
})

module.exports = router;
