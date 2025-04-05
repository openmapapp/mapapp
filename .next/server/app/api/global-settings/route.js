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
exports.id = "app/api/global-settings/route";
exports.ids = ["app/api/global-settings/route"];
exports.modules = {

/***/ "(rsc)/./actions/globalSettings.ts":
/*!***********************************!*\
  !*** ./actions/globalSettings.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getGlobalSettings: () => (/* binding */ getGlobalSettings)\n/* harmony export */ });\n/* harmony import */ var private_next_rsc_server_reference__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! private-next-rsc-server-reference */ \"(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js\");\n/* harmony import */ var private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! private-next-rsc-action-encryption */ \"(rsc)/./node_modules/next/dist/server/app-render/encryption.js\");\n/* harmony import */ var private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/db */ \"(rsc)/./db.ts\");\n/* harmony import */ var private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! private-next-rsc-action-validate */ \"(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js\");\n/* __next_internal_action_entry_do_not_use__ {\"000de3afa257081b108ce76a24ea525530f72a0673\":\"getGlobalSettings\"} */ \n\n\n// Fetch Global Settings\nasync function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getGlobalSettings() {\n    const settings = await _db__WEBPACK_IMPORTED_MODULE_2__[\"default\"].globalSettings.findFirst();\n    return settings;\n}\n\n(0,private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_3__.ensureServerEntryExports)([\n    getGlobalSettings\n]);\n(0,private_next_rsc_server_reference__WEBPACK_IMPORTED_MODULE_0__.registerServerReference)(getGlobalSettings, \"000de3afa257081b108ce76a24ea525530f72a0673\", null);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hY3Rpb25zL2dsb2JhbFNldHRpbmdzLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRXNCO0FBRXRCLHdCQUF3QjtBQUNqQixlQUFlQyx1Q0FBZSxHQUFmQTtJQUNwQixNQUFNQyxXQUFXLE1BQU1GLDJDQUFFQSxDQUFDRyxjQUFjLENBQUNDLFNBQVM7SUFDbEQsT0FBT0Y7QUFDVDs7O0lBSHNCRDs7QUFBQUEsMEZBQUFBLENBQUFBIiwic291cmNlcyI6WyIvVXNlcnMvTmF0aGFuL0xpYnJhcnkvQ2xvdWRTdG9yYWdlL0Ryb3Bib3gvVGVjaC9wcm9qZWN0cy9tYXBhcHAvYWN0aW9ucy9nbG9iYWxTZXR0aW5ncy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IGRiIGZyb20gXCJAL2RiXCI7XG5cbi8vIEZldGNoIEdsb2JhbCBTZXR0aW5nc1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdsb2JhbFNldHRpbmdzKCkge1xuICBjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdsb2JhbFNldHRpbmdzLmZpbmRGaXJzdCgpO1xuICByZXR1cm4gc2V0dGluZ3M7XG59XG4iXSwibmFtZXMiOlsiZGIiLCJnZXRHbG9iYWxTZXR0aW5ncyIsInNldHRpbmdzIiwiZ2xvYmFsU2V0dGluZ3MiLCJmaW5kRmlyc3QiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./actions/globalSettings.ts\n");

/***/ }),

/***/ "(rsc)/./app/api/global-settings/route.ts":
/*!******************************************!*\
  !*** ./app/api/global-settings/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _actions_globalSettings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/actions/globalSettings */ \"(rsc)/./actions/globalSettings.ts\");\n\n\nasync function GET() {\n    try {\n        const settings = await (0,_actions_globalSettings__WEBPACK_IMPORTED_MODULE_1__.getGlobalSettings)();\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(settings);\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch settings\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2dsb2JhbC1zZXR0aW5ncy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMkM7QUFDa0I7QUFFdEQsZUFBZUU7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUYsMEVBQWlCQTtRQUN4QyxPQUFPRCxxREFBWUEsQ0FBQ0ksSUFBSSxDQUFDRDtJQUMzQixFQUFFLE9BQU9FLE9BQU87UUFDZCxPQUFPTCxxREFBWUEsQ0FBQ0ksSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQTJCLEdBQ3BDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvTmF0aGFuL0xpYnJhcnkvQ2xvdWRTdG9yYWdlL0Ryb3Bib3gvVGVjaC9wcm9qZWN0cy9tYXBhcHAvYXBwL2FwaS9nbG9iYWwtc2V0dGluZ3Mvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyBnZXRHbG9iYWxTZXR0aW5ncyB9IGZyb20gXCJAL2FjdGlvbnMvZ2xvYmFsU2V0dGluZ3NcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGdldEdsb2JhbFNldHRpbmdzKCk7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHNldHRpbmdzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byBmZXRjaCBzZXR0aW5nc1wiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0R2xvYmFsU2V0dGluZ3MiLCJHRVQiLCJzZXR0aW5ncyIsImpzb24iLCJlcnJvciIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/global-settings/route.ts\n");

/***/ }),

/***/ "(rsc)/./db.ts":
/*!***************!*\
  !*** ./db.ts ***!
  \***************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prismaClientSingleton = ()=>{\n    return new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n};\nconst db = globalThis.prismaGlobal ?? prismaClientSingleton();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (db);\nif (true) globalThis.prismaGlobal = db;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9kYi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUMsTUFBTUMsd0JBQXdCO0lBQzVCLE9BQU8sSUFBSUQsd0RBQVlBO0FBQ3pCO0FBTUEsTUFBTUUsS0FBS0MsV0FBV0MsWUFBWSxJQUFJSDtBQUV0QyxpRUFBZUMsRUFBRUEsRUFBQztBQUVsQixJQUFJRyxJQUFxQyxFQUFFRixXQUFXQyxZQUFZLEdBQUdGIiwic291cmNlcyI6WyIvVXNlcnMvTmF0aGFuL0xpYnJhcnkvQ2xvdWRTdG9yYWdlL0Ryb3Bib3gvVGVjaC9wcm9qZWN0cy9tYXBhcHAvZGIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbmNvbnN0IHByaXNtYUNsaWVudFNpbmdsZXRvbiA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBQcmlzbWFDbGllbnQoKTtcbn07XG5cbmRlY2xhcmUgY29uc3QgZ2xvYmFsVGhpczoge1xuICBwcmlzbWFHbG9iYWw6IFJldHVyblR5cGU8dHlwZW9mIHByaXNtYUNsaWVudFNpbmdsZXRvbj47XG59ICYgdHlwZW9mIGdsb2JhbDtcblxuY29uc3QgZGIgPSBnbG9iYWxUaGlzLnByaXNtYUdsb2JhbCA/PyBwcmlzbWFDbGllbnRTaW5nbGV0b24oKTtcblxuZXhwb3J0IGRlZmF1bHQgZGI7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIGdsb2JhbFRoaXMucHJpc21hR2xvYmFsID0gZGI7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hQ2xpZW50U2luZ2xldG9uIiwiZGIiLCJnbG9iYWxUaGlzIiwicHJpc21hR2xvYmFsIiwicHJvY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./db.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fglobal-settings%2Froute&page=%2Fapi%2Fglobal-settings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fglobal-settings%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fglobal-settings%2Froute&page=%2Fapi%2Fglobal-settings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fglobal-settings%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_Nathan_Library_CloudStorage_Dropbox_Tech_projects_mapapp_app_api_global_settings_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/global-settings/route.ts */ \"(rsc)/./app/api/global-settings/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/global-settings/route\",\n        pathname: \"/api/global-settings\",\n        filename: \"route\",\n        bundlePath: \"app/api/global-settings/route\"\n    },\n    resolvedPagePath: \"/Users/Nathan/Library/CloudStorage/Dropbox/Tech/projects/mapapp/app/api/global-settings/route.ts\",\n    nextConfigOutput,\n    userland: _Users_Nathan_Library_CloudStorage_Dropbox_Tech_projects_mapapp_app_api_global_settings_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZnbG9iYWwtc2V0dGluZ3MlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmdsb2JhbC1zZXR0aW5ncyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmdsb2JhbC1zZXR0aW5ncyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRk5hdGhhbiUyRkxpYnJhcnklMkZDbG91ZFN0b3JhZ2UlMkZEcm9wYm94JTJGVGVjaCUyRnByb2plY3RzJTJGbWFwYXBwJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRk5hdGhhbiUyRkxpYnJhcnklMkZDbG91ZFN0b3JhZ2UlMkZEcm9wYm94JTJGVGVjaCUyRnByb2plY3RzJTJGbWFwYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNnRDtBQUM3SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL05hdGhhbi9MaWJyYXJ5L0Nsb3VkU3RvcmFnZS9Ecm9wYm94L1RlY2gvcHJvamVjdHMvbWFwYXBwL2FwcC9hcGkvZ2xvYmFsLXNldHRpbmdzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9nbG9iYWwtc2V0dGluZ3Mvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9nbG9iYWwtc2V0dGluZ3NcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2dsb2JhbC1zZXR0aW5ncy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9OYXRoYW4vTGlicmFyeS9DbG91ZFN0b3JhZ2UvRHJvcGJveC9UZWNoL3Byb2plY3RzL21hcGFwcC9hcHAvYXBpL2dsb2JhbC1zZXR0aW5ncy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fglobal-settings%2Froute&page=%2Fapi%2Fglobal-settings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fglobal-settings%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Factions%2FglobalSettings.ts%22%2C%5B%7B%22id%22%3A%22000de3afa257081b108ce76a24ea525530f72a0673%22%2C%22exportedName%22%3A%22getGlobalSettings%22%7D%5D%5D%5D&__client_imported__=!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Factions%2FglobalSettings.ts%22%2C%5B%7B%22id%22%3A%22000de3afa257081b108ce76a24ea525530f72a0673%22%2C%22exportedName%22%3A%22getGlobalSettings%22%7D%5D%5D%5D&__client_imported__=! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"000de3afa257081b108ce76a24ea525530f72a0673\": () => (/* reexport safe */ _Users_Nathan_Library_CloudStorage_Dropbox_Tech_projects_mapapp_actions_globalSettings_ts__WEBPACK_IMPORTED_MODULE_0__.getGlobalSettings)\n/* harmony export */ });\n/* harmony import */ var _Users_Nathan_Library_CloudStorage_Dropbox_Tech_projects_mapapp_actions_globalSettings_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/globalSettings.ts */ \"(rsc)/./actions/globalSettings.ts\");\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWZsaWdodC1hY3Rpb24tZW50cnktbG9hZGVyLmpzP2FjdGlvbnM9JTVCJTVCJTIyJTJGVXNlcnMlMkZOYXRoYW4lMkZMaWJyYXJ5JTJGQ2xvdWRTdG9yYWdlJTJGRHJvcGJveCUyRlRlY2glMkZwcm9qZWN0cyUyRm1hcGFwcCUyRmFjdGlvbnMlMkZnbG9iYWxTZXR0aW5ncy50cyUyMiUyQyU1QiU3QiUyMmlkJTIyJTNBJTIyMDAwZGUzYWZhMjU3MDgxYjEwOGNlNzZhMjRlYTUyNTUzMGY3MmEwNjczJTIyJTJDJTIyZXhwb3J0ZWROYW1lJTIyJTNBJTIyZ2V0R2xvYmFsU2V0dGluZ3MlMjIlN0QlNUQlNUQlNUQmX19jbGllbnRfaW1wb3J0ZWRfXz0hIiwibWFwcGluZ3MiOiI7Ozs7OztBQUM2SyIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IHsgZ2V0R2xvYmFsU2V0dGluZ3MgYXMgXCIwMDBkZTNhZmEyNTcwODFiMTA4Y2U3NmEyNGVhNTI1NTMwZjcyYTA2NzNcIiB9IGZyb20gXCIvVXNlcnMvTmF0aGFuL0xpYnJhcnkvQ2xvdWRTdG9yYWdlL0Ryb3Bib3gvVGVjaC9wcm9qZWN0cy9tYXBhcHAvYWN0aW9ucy9nbG9iYWxTZXR0aW5ncy50c1wiXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Factions%2FglobalSettings.ts%22%2C%5B%7B%22id%22%3A%22000de3afa257081b108ce76a24ea525530f72a0673%22%2C%22exportedName%22%3A%22getGlobalSettings%22%7D%5D%5D%5D&__client_imported__=!\n");

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

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

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

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fglobal-settings%2Froute&page=%2Fapi%2Fglobal-settings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fglobal-settings%2Froute.ts&appDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2FNathan%2FLibrary%2FCloudStorage%2FDropbox%2FTech%2Fprojects%2Fmapapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();