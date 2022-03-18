// @flow
import express from 'express';
import cors from 'cors';
import path from 'path';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import bodyParser from 'body-parser';
import { configureStore } from 'store';
import serverRender from 'server/render';
import { i18n } from 'lib/i18n';
import api from 'lib/apiClient';
import newApi from 'lib/apiClientNew';

// import session from 'express-session';
import fs from 'fs';
// import connectRedis from 'connect-redis';
import paths from '../config/paths';
// import * as userActions from 'components/User/user.actions';

require('dotenv').config();
// const RedisStore = connectRedis(session);
// const expressSession = session({
//   store: new RedisStore(),
//   secret: 'KeyboardCatAshitaka',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     // secure: true,
//   },
// });

// let messages;

// try {
//   messages = require('../tmp/messages.json');
// } catch (e) {
//   messages = {};
// }

const app = express();

app.use(express.static('public'));
app.use(paths.publicPath, express.static(paths.clientBuild));
// if (process.env.NODE_ENV === 'development') {
//   // app.use('/favicon.ico', (req, res) => {
//   //   res.send('');
//   // });
// } else {
// }

// app.use(expressSession);
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  // console.log(path.resolve('tmp', 'messages.json'))
  // const messages = JSON.parse(fs.readFileSync(path.resolve('tmp', 'messages.json'), 'utf-8'));
  const messages = JSON.parse(fs.readFileSync(path.resolve('src/resources', 'messages.json'), 'utf-8'));

  i18n.addMessages(messages);

  // if (req.session && req.session.user) {
  //   req.store = configureStore({
  //     initialState: {
  //       auth: {
  //         token: req.session.user.token,
  //         userId: req.session.user.uuid,
  //         user: req.session.user,
  //         enterpriseID: req.session.user.enterpriseId,
  //         company: req.session.company || {},
  //       },
  //     },
  //   });
  // } else {
  req.store = configureStore();
  // }
  api.setStore(req.store);
  newApi.setStore(req.store);

  // req.store.dispatch(userActions.requestFetchList());
  req.messages = messages;
  i18n.addMessages(messages);
  return next();
});

app.use(manifestHelpers({ manifestPath: `${paths.clientBuild}/manifest.json` }));
// app.use('/auth/sign-out', async (req, res) => {
//   try {
//     req.session.user = null;
//     res.json({});
//   } catch (e) {
//     // console.error(e);
//     res.json({
//       error: e,
//     });
//   }
//   // return next();
// });
// app.use('/auth', async (req, res) => {
//   try {
//     const { body } = req;
//     const data = await api.post({
//       data: body,
//       resource: 'enterprise-v3.0/user/login',
//     });
//     req.session.user = data.userDTO;
//     req.session.company = {
//       name: data.companyName,
//       avatar: data.companyAvatarId,
//     };
//     res.json(data);
//   } catch (e) {
//     // console.error(e);
//     res.json({
//       error: e.message,
//     });
//   }
//   // return next();
// });
app.use(serverRender());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  return res.status(404).json({
    status: 'error',
    message: err.message,
    stack:
      // print a nicer stack trace by splitting line breaks and making them array items
      process.env.NODE_ENV === 'development' &&
      (err.stack || '')
        .split('\n')
        .map((line) => line.trim())
        .map((line) => line.split(path.sep).join('/'))
        .map((line) =>
          line.replace(
            process
              .cwd()
              .split(path.sep)
              .join('/'),
            '.'
          )
        ),
  });
});

app.listen(process.env.PORT || 8500, () => {
  console.log(
    `[${new Date().toISOString()}]`,
    chalk.blue(`App is running: 🌎 http://localhost:${process.env.PORT || 8500}`)
  );
});

export default app;
