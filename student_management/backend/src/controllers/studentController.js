const { Student } = require('../models');
const { wrap } = require('../middleware');
const { pick } = require('../utils');

const fields = ['name', 'email', 'phone', 'age'];

const list = wrap(async (req, res) => {
  res.json(await Student.findAll({ order: [['id', 'ASC']] }));
});

const create = wrap(async (req, res) => {
  res.status(201).json(await Student.create(pick(req.body, fields)));
});

const update = wrap(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(await student.update(pick(req.body, fields)));
});

const remove = wrap(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await student.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = { list, create, update, remove };