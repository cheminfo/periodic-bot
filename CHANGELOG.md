# Changelog

## [1.0.1](https://github.com/cheminfo/periodic-bot/compare/v1.0.0...v1.0.1) (2026-04-20)


### Bug Fixes

* **compose:** replace nproc ulimit with pids_limit ([07e471b](https://github.com/cheminfo/periodic-bot/commit/07e471b78d9e35b8e96bf2ce280403f7dab82d51))

## 1.0.0 (2026-04-20)


### ⚠ BREAKING CHANGES

* the container now requires Node.js 24 (previously
* project is now ESM-only and requires Node.js >= 20.19.

### Features

* add isotopes information ([c02e68e](https://github.com/cheminfo/periodic-bot/commit/c02e68ef51c6704530d1ed7f6699493f2f335afb))
* allows to search by closest elements ([c6749d7](https://github.com/cheminfo/periodic-bot/commit/c6749d7cc66e526f68543f6f4741796714bf2739))
* allows to search by closest elements ([93543b8](https://github.com/cheminfo/periodic-bot/commit/93543b85abddb911ff77f6d5e07d1919cf84aded))
* informs when the match it's not exact ([655e5fb](https://github.com/cheminfo/periodic-bot/commit/655e5fb067b0dd80fcce8721d80b3c6b4cb49d30))
* migrate to ESM and swap deprecated chemcalc for mf-parser ([cfcd3fd](https://github.com/cheminfo/periodic-bot/commit/cfcd3fde05be87b336c545691091051d4fe632b2))
* rewrite Docker setup on node:24-alpine with hardened compose example ([9f23421](https://github.com/cheminfo/periodic-bot/commit/9f23421188c819335fd687cd7ca44670587605ca))


### Miscellaneous Chores

* release 1.0.0 ([04cf60a](https://github.com/cheminfo/periodic-bot/commit/04cf60a9c5263cb646e7638bdd8a01749f30e711))
