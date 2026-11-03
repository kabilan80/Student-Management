const { Enrollment, Student, Course } = require('../models');
const { wrap } = require('../middleware');

const withDetails = [{ model: Student }, { model: Course }];

const list = wrap(async (req, res) => {
  res.json(await Enrollment.findAll({ include: withDetails, order: [['id', 'ASC']] }));
});

const create = wrap(async (req, res) => {
  const { studentId, courseId, date, status } = req.body;

  if (!(await Student.findByPk(studentId)) || !(await Course.findByPk(courseId))) {
    return res.status(400).json({ message: 'Please select a valid student and course' });
  }
  if (await Enrollment.findOne({ where: { StudentId: studentId, CourseId: courseId } })) {
    return res.status(409).json({ message: 'This student is already enrolled in that course.' });
  }

  const enrollment = await Enrollment.create({ StudentId: studentId, CourseId: courseId, date, status });
  res.status(201).json(await Enrollment.findByPk(enrollment.id, { include: withDetails }));
});

const update = wrap(async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

  const { studentId, courseId, date, status } = req.body;
  if (!(await Student.findByPk(studentId)) || !(await Course.findByPk(courseId))) {
    return res.status(400).json({ message: 'Please select a valid student and course' });
  }
  const duplicate = await Enrollment.findOne({ where: { StudentId: studentId, CourseId: courseId } });
  if (duplicate && duplicate.id !== enrollment.id) {
    return res.status(409).json({ message: 'This student is already enrolled in that course.' });
  }

  await enrollment.update({ StudentId: studentId, CourseId: courseId, date, status });
  res.json(await Enrollment.findByPk(enrollment.id, { include: withDetails }));
});

const remove = wrap(async (req, res) => {
  const deleted = await Enrollment.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Enrollment not found' });
  res.json({ message: 'Deleted' });
});

module.exports = { list, create, update, remove };