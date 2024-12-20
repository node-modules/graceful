# Changelog

## [2.0.0](https://github.com/node-modules/graceful/compare/v1.1.0...v2.0.0) (2024-12-15)


### ⚠ BREAKING CHANGES

* drop Node.js < 18.19.0 support

part of https://github.com/eggjs/egg/issues/3644

https://github.com/eggjs/egg/issues/5257

closes https://github.com/node-modules/graceful/issues/16

<!-- This is an auto-generated comment: release notes by coderabbit.ai
-->
## Summary by CodeRabbit

- **New Features**
	- Introduced a new ESLint configuration for TypeScript and Node.js.
	- Added a new GitHub Actions workflow for package publishing.
	- Implemented a new TypeScript configuration for enhanced type safety.
	- Created a new test suite for validating worker process behavior.
	- Added a new test suite for verifying child process behavior.

- **Bug Fixes**
- Updated Node.js CI workflow to include newer versions and improved
configurations.

- **Documentation**
	- Enhanced README with updated badges and installation instructions.
	- Updated example documentation to reflect file extension changes.

- **Chores**
	- Removed outdated files and workflows to streamline the repository.
	- Updated `.gitignore` to exclude additional files and directories.
<!-- end of auto-generated comment: release notes by coderabbit.ai -->

### Features

* support cjs and esm both by tshy ([#17](https://github.com/node-modules/graceful/issues/17)) ([7192a67](https://github.com/node-modules/graceful/commit/7192a67f5beeee90e085417287ad3918c21dd271))

1.1.0 / 2022-09-22
==================

**features**
  * [[`e571409`](http://github.com/node-modules/graceful/commit/e571409d957cf1f209b4d61e7e3e4ede4babc76f)] - feat: support ignoreCode (#13) (hyj1991 <<yeekwanvong@gmail.com>>)

**others**
  * [[`52f008a`](http://github.com/node-modules/graceful/commit/52f008a3ed71764e288cf35281c87ab1ead3176f)] - 🤖 TEST: Use Github Action (fengmk2 <<fengmk2@gmail.com>>)

1.0.2 / 2018-10-31
==================

**others**
  * [[`fa719ff`](http://github.com/node-modules/graceful/commit/fa719ff9c9793c28b624a919b92bfb2a269547c6)] -  fix: graceful exit kill children (#12) (Yiyu He <<dead_horse@qq.com>>)

1.0.1 / 2016-06-23
==================

  * fix: print more server connections log (#9)
  * fix: ignore GRACEFUL_COV env

1.0.0 / 2014-11-05
==================

 * refator: use express instead connect on example

0.1.0 / 2014-05-29
==================

 * send disconnect message

0.0.6 / 2014-02-17 
==================

  * add console.error(err.stack) by default (@dead-horse)
  * add npm image
  * support coveralls

0.0.5 / 2013-04-18 
==================

  * fixed header sent bug

0.0.4 / 2013-04-18 
==================

  * add options.worker
  * add custom error log demo

0.0.3 / 2013-04-14 
==================

  * Let http server set `Connection: close` header, and close the current request socket. fixed #2

0.0.2 / 2013-04-14 
==================

  * Support multi servers close fixed #1
  * update readme

0.0.1 / 2013-04-12 
==================

  * first commit
