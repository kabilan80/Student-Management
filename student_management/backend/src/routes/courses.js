const router = require('express').Router();
const course = require('../controllers/courseController');

router.get('/', course.list);
router.post('/', course.create);
router.put('/:id', course.update);
router.delete('/:id', course.remove);

module.exports = router;
