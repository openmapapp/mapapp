/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...all]/route";
exports.ids = ["app/api/auth/[...all]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/[...all]/route.ts":
/*!****************************************!*\
  !*** ./app/api/auth/[...all]/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _app_lib_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/app/lib/auth */ \"(rsc)/./app/lib/auth.ts\");\n/* harmony import */ var better_auth_next_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! better-auth/next-js */ \"(rsc)/./node_modules/better-auth/dist/integrations/next-js.mjs\");\n\n\nconst { POST, GET } = (0,better_auth_next_js__WEBPACK_IMPORTED_MODULE_1__.toNextJsHandler)(_app_lib_auth__WEBPACK_IMPORTED_MODULE_0__.auth);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLmFsbF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFzQztBQUNnQjtBQUUvQyxNQUFNLEVBQUVFLElBQUksRUFBRUMsR0FBRyxFQUFFLEdBQUdGLG9FQUFlQSxDQUFDRCwrQ0FBSUEsRUFBRSIsInNvdXJjZXMiOlsiL1VzZXJzL05hdGhhbi9MaWJyYXJ5L0Nsb3VkU3RvcmFnZS9Ecm9wYm94L1RlY2gvcHJvamVjdHMvbWFwYXBwL2FwcC9hcGkvYXV0aC9bLi4uYWxsXS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdXRoIH0gZnJvbSBcIkAvYXBwL2xpYi9hdXRoXCI7XG5pbXBvcnQgeyB0b05leHRKc0hhbmRsZXIgfSBmcm9tIFwiYmV0dGVyLWF1dGgvbmV4dC1qc1wiO1xuXG5leHBvcnQgY29uc3QgeyBQT1NULCBHRVQgfSA9IHRvTmV4dEpzSGFuZGxlcihhdXRoKTtcbiJdLCJuYW1lcyI6WyJhdXRoIiwidG9OZXh0SnNIYW5kbGVyIiwiUE9TVCIsIkdFVCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...all]/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/lib/auth.ts":
/*!*************************!*\
  !*** ./app/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   auth: () => (/* binding */ auth)\n/* harmony export */ });\n/* harmony import */ var better_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! better-auth */ \"(rsc)/./node_modules/better-auth/dist/index.mjs\");\n/* harmony import */ var better_auth_plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! better-auth/plugins */ \"(rsc)/./node_modules/better-auth/dist/plugins/index.mjs\");\n/* harmony import */ var kysely__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! kysely */ \"(rsc)/./node_modules/kysely/dist/esm/dialect/postgres/postgres-dialect.js\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nconst dialect = new kysely__WEBPACK_IMPORTED_MODULE_3__.PostgresDialect({\n    pool: new pg__WEBPACK_IMPORTED_MODULE_2__.Pool({\n        host: \"localhost\",\n        database: \"Nathan\",\n        port: 5432,\n        max: 20\n    })\n});\nconst auth = (0,better_auth__WEBPACK_IMPORTED_MODULE_0__.betterAuth)({\n    database: {\n        dialect,\n        type: \"postgres\"\n    },\n    session: {\n        cookieCache: {\n            enabled: true,\n            maxAge: 5 * 60\n        }\n    },\n    emailAndPassword: {\n        enabled: true,\n        autoSignIn: true\n    },\n    user: {\n        deleteUser: {\n            enabled: true,\n            requirePassword: true\n        }\n    },\n    plugins: [\n        (0,better_auth_plugins__WEBPACK_IMPORTED_MODULE_1__.username)(),\n        (0,better_auth_plugins__WEBPACK_IMPORTED_MODULE_1__.admin)()\n    ]\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQXlDO0FBQ2E7QUFDYjtBQUNmO0FBRTFCLE1BQU1LLFVBQVUsSUFBSUYsbURBQWVBLENBQUM7SUFDbENHLE1BQU0sSUFBSUYsb0NBQUlBLENBQUM7UUFDYkcsTUFBTTtRQUNOQyxVQUFVO1FBQ1ZDLE1BQU07UUFDTkMsS0FBSztJQUNQO0FBQ0Y7QUFFTyxNQUFNQyxPQUFPWCx1REFBVUEsQ0FBQztJQUM3QlEsVUFBVTtRQUNSSDtRQUNBTyxNQUFNO0lBQ1I7SUFDQUMsU0FBUztRQUNQQyxhQUFhO1lBQ1hDLFNBQVM7WUFDVEMsUUFBUSxJQUFJO1FBQ2Q7SUFDRjtJQUNBQyxrQkFBa0I7UUFBRUYsU0FBUztRQUFNRyxZQUFZO0lBQUs7SUFDcERDLE1BQU07UUFDSkMsWUFBWTtZQUNWTCxTQUFTO1lBQ1RNLGlCQUFpQjtRQUNuQjtJQUNGO0lBQ0FDLFNBQVM7UUFBQ3JCLDZEQUFRQTtRQUFJQywwREFBS0E7S0FBRztBQUNoQyxHQUFHIiwic291cmNlcyI6WyIvVXNlcnMvTmF0aGFuL0xpYnJhcnkvQ2xvdWRTdG9yYWdlL0Ryb3Bib3gvVGVjaC9wcm9qZWN0cy9tYXBhcHAvYXBwL2xpYi9hdXRoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJldHRlckF1dGggfSBmcm9tIFwiYmV0dGVyLWF1dGhcIjtcbmltcG9ydCB7IHVzZXJuYW1lLCBhZG1pbiB9IGZyb20gXCJiZXR0ZXItYXV0aC9wbHVnaW5zXCI7XG5pbXBvcnQgeyBQb3N0Z3Jlc0RpYWxlY3QgfSBmcm9tIFwia3lzZWx5XCI7XG5pbXBvcnQgeyBQb29sIH0gZnJvbSBcInBnXCI7XG5cbmNvbnN0IGRpYWxlY3QgPSBuZXcgUG9zdGdyZXNEaWFsZWN0KHtcbiAgcG9vbDogbmV3IFBvb2woe1xuICAgIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4gICAgZGF0YWJhc2U6IFwiTmF0aGFuXCIsXG4gICAgcG9ydDogNTQzMixcbiAgICBtYXg6IDIwLFxuICB9KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYXV0aCA9IGJldHRlckF1dGgoe1xuICBkYXRhYmFzZToge1xuICAgIGRpYWxlY3QsXG4gICAgdHlwZTogXCJwb3N0Z3Jlc1wiLFxuICB9LFxuICBzZXNzaW9uOiB7XG4gICAgY29va2llQ2FjaGU6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBtYXhBZ2U6IDUgKiA2MCwgLy8gY2FjaGUgZm9yIDUgbWludXRlc1xuICAgIH0sXG4gIH0sXG4gIGVtYWlsQW5kUGFzc3dvcmQ6IHsgZW5hYmxlZDogdHJ1ZSwgYXV0b1NpZ25JbjogdHJ1ZSB9LFxuICB1c2VyOiB7XG4gICAgZGVsZXRlVXNlcjoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIHJlcXVpcmVQYXNzd29yZDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbdXNlcm5hbWUoKSwgYWRtaW4oKV0sXG59KTtcblxuZXhwb3J0IHR5cGUgU2Vzc2lvbiA9IHR5cGVvZiBhdXRoLiRJbmZlci5TZXNzaW9uO1xuIl0sIm5hbWVzIjpbImJldHRlckF1dGgiLCJ1c2VybmFtZSIsImFkbWluIiwiUG9zdGdyZXNEaWFsZWN0IiwiUG9vbCIsImRpYWxlY3QiLCJwb29sIiwiaG9zdCIsImRhdGFiYXNlIiwicG9ydCIsIm1heCIsImF1dGgiLCJ0eXBlIiwic2Vzc2lvbiIsImNvb2tpZUNhY2hlIiwiZW5hYmxlZCIsIm1heEFnZSIsImVtYWlsQW5kUGFzc3dvcmQiLCJhdXRvU2lnbkluIiwidXNlciIsImRlbGV0ZVVzZXIiLCJyZXF1aXJlUGFzc3dvcmQiLCJwbHVnaW5zIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...all%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...all%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...all%5D%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...all%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...all%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...all%5D%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_Nathan_Library_CloudStorage_Dropbox_Tech_projects_mapapp_app_api_auth_all_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...all]/route.ts */ \"(rsc)/./app/api/auth/[...all]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...all]/route\",\n        pathname: \"/api/auth/[...all]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...all]/route\"\n    },\n    resolvedPagePath: \"/Users/Nathan/Library/CloudStorage/Dropbox/Tech/projects/mapapp/app/api/auth/[...all]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_Nathan_Library_CloudStorage_Dropbox_Tech_projects_mapapp_app_api_auth_all_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4uYWxsJTVEJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGJTVCLi4uYWxsJTVEJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRiU1Qi4uLmFsbCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRk5hdGhhbiUyRkxpYnJhcnklMkZDbG91ZFN0b3JhZ2UlMkZEcm9wYm94JTJGVGVjaCUyRnByb2plY3RzJTJGbWFwYXBwJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRk5hdGhhbiUyRkxpYnJhcnklMkZDbG91ZFN0b3JhZ2UlMkZEcm9wYm94JTJGVGVjaCUyRnByb2plY3RzJTJGbWFwYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM4QztBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL05hdGhhbi9MaWJyYXJ5L0Nsb3VkU3RvcmFnZS9Ecm9wYm94L1RlY2gvcHJvamVjdHMvbWFwYXBwL2FwcC9hcGkvYXV0aC9bLi4uYWxsXS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4uYWxsXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLmFsbF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvWy4uLmFsbF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvTmF0aGFuL0xpYnJhcnkvQ2xvdWRTdG9yYWdlL0Ryb3Bib3gvVGVjaC9wcm9qZWN0cy9tYXBhcHAvYXBwL2FwaS9hdXRoL1suLi5hbGxdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...all%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...all%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...all%5D%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ }),

/***/ "node:events":
/*!******************************!*\
  !*** external "node:events" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("pg");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/better-auth","vendor-chunks/zod","vendor-chunks/@better-fetch","vendor-chunks/kysely","vendor-chunks/jose","vendor-chunks/@noble","vendor-chunks/@better-auth","vendor-chunks/uncrypto","vendor-chunks/rou3","vendor-chunks/defu","vendor-chunks/better-call"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...all%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...all%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...all%5D%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();