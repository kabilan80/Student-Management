const router = require('express').Router();
const student = require('../controllers/studentController');

router.get('/', student.list);
router.post('/', student.create);
router.put('/:id', student.update);
router.delete('/:id', student.remove);

module.exports = router;
