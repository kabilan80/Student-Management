const { Course } = require('../models');
const { wrap } = require('../middleware');
const { pick } = require('../utils');

const fields = ['name', 'duration', 'fee'];

const list = wrap(async (req, res) => {
  res.json(await Course.findAll({ order: [['id', 'ASC']] }));
});

const create = wrap(async (req, res) => {
  res.status(201).json(await Course.create(pick(req.body, fields)));
});

const update = wrap(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(await course.update(pick(req.body, fields)));
});

const remove = wrap(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  await course.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = { list, create, update, remove };
