require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { sequelize } = require('./src/models');
const passport = require('./src/config/passport');
const { requireAuth, errorHandler } = require('./src/middleware');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/students', requireAuth, require('./src/routes/students'));
app.use('/api/courses', requireAuth, require('./src/routes/courses'));
app.use('/api/enrollments', requireAuth, require('./src/routes/enrollments'));

app.use(errorHandler);

sequelize.sync().then(() => sessionStore.sync())
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Could not connect to the database:', err.message);
    process.exit(1);
  });