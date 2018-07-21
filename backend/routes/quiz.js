var express = require('express');
var router = express.Router();

var Quiz = require('../models/quiz');

/* GET Quiz listing. */
router.get('/', function(req, res, next) {

	Quiz.find((err, quizes) => {
		if (err) {
			console.log(err);

		} else {
			res.json(quizes);
		}
	});
  //res.send('respond with a resource');
});

/* GET one quiz listing. */
router.get('/:id', function(req, res, next) {

	Quiz.findById(req.params.id, (err, quiz) => {
		if (err) {
			console.log(err);

		} else {
			res.json(quiz);
		}
	})
  res.send('respond update with a resource');
});

router.route('/add').post((req, res) => {
    var quiz = new Quiz(req.body);
    quiz.save()
        .then(quiz => {
            res.status(200).json({'quiz': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.route('/update/:id').post((req, res) => {
    Quiz.findById(req.params.id, (err, quiz) => {
        if (!quiz)
            return next(new Error('Could not load document'));
        else {
            quiz.title = req.body.title;
            quiz.responsible = req.body.responsible;
            quiz.description = req.body.description;
            quiz.severity = req.body.severity;
            quiz.status = req.body.status;

            quiz.save().then(quiz => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/delete/:id').get((req, res) => {
    Quiz.findByIdAndRemove({_id: req.params.id}, (err, quiz) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    })
})

module.exports = router;
