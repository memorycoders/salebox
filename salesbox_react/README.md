
# Getting started

  1. npm install
  2. npm start

## [Unit tests](./docs/unit-test.md)

We are using Jest and Enzyme to conduct our unit testing.

## [Ideas](./TODO.md)


## [Storybook](./docs/storybook.md)

Storybook is a development environment for UI components. It allows you to browse a component library, view the different states of each component, and interactively develop and test components. It can be used with different libraries like React, React-Native, Angular, Vue

## Linting

`lint-staged` runs on precommit making sure that the code has proper formatting/style/types before committing. There are two other scripts that will help you keeping the code clean:

  1. `npm run lint` will give you a list of errors/warnings in your code
  2. `npm run lint:fix` will fix coding errors/warnings that are automatically fixable

## Fixme

There is also a script available for keeping track of technological debt in the code. Using [fixme](https://github.com/JohnPostlethwait/fixme), you can get a list of all the comments marked with NOTE, OPTIMIZE, TODO, HACK, XXX, FIXME, and BUG. This is a good way to get a list of things that still need an attention. Run `npm run fixme` To see the list.

## Used packages

This project has out-of-the-box support for the following things:

*  General Setup
  * Babel 7 (Beta)
  * Webpack 4
  * ESLint 4 (with a set of custom rules which may be mostly identical to AirBnB with some personal flavor added)
  * Flow Type
  * Prettier
  * Jest 22
  * CSS Modules
  * Fixme
  * PostCSS
  * ... with precommit hooks via lint-staged + Husky

-  Libs and Dependencies
  * React 16.3
  * Server side prerendering with Express
  * Redux + Thunk middleware
  * Redux-sagas
  * React-virtualized (Table & Repeat-able Rendering)
  * Immer
  * Reselect
  * React Router 4
  * React Helmet
  * Oxygen i18n

TODO
## Split features



## DEPLOY
+ ssh to server using pem file
+ setup pm2 for progress node js
+ setup node js > - v10
+ create app folder and cd into app folder
+ setup git and clone project in app folder
+ setup yarn
+ run: sudo yarn (install module for project)
+ sudo yarn build
+ run: pm2 start server.js --env production (server.js is file in ~/build/server/)


## Note

+ - Settings icon has one size
- Advanced search icon and History icons has one size 
- global add icon and filter icons have another size different size
- Main Menu icons has another size
- Right side panel icons has another size
All icons + circle buttons in list should have same size as Settings icon
Also, user filter should not have grey circle behind, not different color is necessary