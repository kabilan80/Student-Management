const pick = (body, fields) =>
  Object.fromEntries(fields.filter((f) => 
    body[f] !== undefined).map((f) => [f, typeof body[f] === 'string' ? body[f].trim() : body[f]]));

module.exports = { pick };