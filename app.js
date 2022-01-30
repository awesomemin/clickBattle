const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { sequelize } = require('./models');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const User = require('./models/user');
const Univ = require('./models/univ');
const helmet = require('helmet');
const hpp = require('hpp');

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

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  try{
    if (req.cookies.id) {
      res.redirect('/main');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    next(err);
  }
})

app.get('/login', (req, res, next) => {
  try {
    res.render('login.html');
  } catch (err) {
    next(err);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.create({
      name: req.body.name,
      univ: req.body.univ,
    });
    res.cookie('id', user.dataValues.id, {
      expires: new Date('2024-05-03'),
    });
    res.send('ok');
  } catch (err) {
    next(err);
  }
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

app.get('/main.univ', async (req, res, next) => {
  try {
    const data = await Univ.findAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
})

app.get('/main.user', async (req, res, next) => {
  try {
    const data = await User.findAll({
      where: {
        univ: req.query.univ
      }
    })
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
    if(req.body.point >= 25) {
      req.body.point = 25;
    }
    await User.update({ point: user[0].dataValues.point + req.body.point }, {
      where: {
        id: user[0].dataValues.id,
      }
    });
    await Univ.update({ point: univ[0].dataValues.point + req.body.point }, {
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