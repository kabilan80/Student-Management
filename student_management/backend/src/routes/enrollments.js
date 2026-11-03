const router = require('express').Router();
const enrollment = require('../controllers/enrollmentController');

router.get('/', enrollment.list);
router.post('/', enrollment.create);
router.put('/:id', enrollment.update);
router.delete('/:id', enrollment.remove);

module.exports = router;
