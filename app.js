const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { sequelize } = require('./models');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const User = require('./models/user');
const Univ = require('./models/univ');

const app = express();
app.set('port', process.env.PORT || 3001);
app.set('view engine', 'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res, next) => {
  res.render('login.html');
});

app.post('/login', async (req, res, next) => {
  console.log(req.body);
  const user = await User.create({
    name: req.body.name,
    univ: req.body.univ,
  });
  res.cookie('id', user.dataValues.id, {
    expires: new Date('2024-05-03'),
  });
  res.send('ok');
});

app.get('/univ', (req, res, next) => {
  res.render('select.html');
});

app.get('/main', async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {
        id: req.cookies.id,
      }
    });
    const univ = await Univ.findAll({
      where: {
        name: user[0].dataValues.univ,
      }
    });
    res.render('main.html', {
      indivScore: user[0].dataValues.point,
      univScore: univ[0].dataValues.point,
      userName: user[0].dataValues.name,
      univName: univ[0].dataValues.name,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/main.json', async (req, res, next) => {
  try {
    const data = await Univ.findAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
})

app.post('/main', async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {
        id: req.cookies.id,
      }
    });
    const univ = await Univ.findAll({
      where: {
        name: user[0].dataValues.univ,
      }
    });
    await User.update({ point: user[0].dataValues.point + 1 }, {
      where: {
        id: user[0].dataValues.id,
      }
    });
    await Univ.update({ point: univ[0].dataValues.point + 1 }, {
      where: {
        id: univ[0].dataValues.id,
      }
    });
    const data = {
      user: user,
      univ: univ,
    };
    res.json(data);
  } catch (err) {
    next(err);
  }
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('sry');
});

app.listen(app.get('port'), () => {
  console.log('3001번 포트에서 대기 중');
});