module.exports = {

"[externals]/@prisma/client [external] (@prisma/client, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/db.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const prismaClientSingleton = ()=>{
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
};
const db = globalThis.prismaGlobal ?? prismaClientSingleton();
const __TURBOPACK__default__export__ = db;
if ("TURBOPACK compile-time truthy", 1) globalThis.prismaGlobal = db;
}}),
"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0":"getGlobalSettings"} */ __turbopack_context__.s({
    "getGlobalSettings": (()=>getGlobalSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getGlobalSettings() {
    const settings = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].globalSettings.findFirst();
    return settings;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getGlobalSettings
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getGlobalSettings, "000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0", null);
}}),
"[project]/app/lib/requireRole.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "requireRole": (()=>requireRole)
});
const requireRole = (session, requiredRole)=>{
    console.log("Session in requireRole:", session);
    if (!session || typeof session !== "object" || !("user" in session) || !session.user) {
        throw new Error("User is not authenticated");
    }
    const rolesHierarchy = {
        user: 1,
        moderator: 2,
        admin: 3
    };
    if (rolesHierarchy[session.user.role] < rolesHierarchy[requiredRole]) {
        throw new Error(`User does not have the required role: ${requiredRole}`);
    }
};
}}),
"[project]/actions/adminActions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40e4be2460b9fc8133f79cf220f9b4e530f4ab891a":"fetchUsers","60d7caf4c34c68298806ec8c469ac629fc494ef713":"updateGlobalSettings","60ed96673b12aa179b12549bd6b3a4aa642d16f1b5":"deleteUser","7047e49ae936daefad9e6564922da49085f02cc24c":"updateUserRole"} */ __turbopack_context__.s({
    "deleteUser": (()=>deleteUser),
    "fetchUsers": (()=>fetchUsers),
    "updateGlobalSettings": (()=>updateGlobalSettings),
    "updateUserRole": (()=>updateUserRole)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$requireRole$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/requireRole.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateGlobalSettings(session, updatedSettings) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$requireRole$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])(session, "admin");
    const { id, ...settingWithoutId } = updatedSettings;
    return await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].globalSettings.update({
        where: {
            id: 1
        },
        data: settingWithoutId
    });
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ fetchUsers(session) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$requireRole$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])(session, "admin");
    const users = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            role: true
        }
    });
    // Format createdAt to "hh:mm MM/DD/YYYY"
    const formattedUsers = users.map((user)=>({
            ...user,
            role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            createdAt: user.createdAt.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour12: false
            })
        }));
    return formattedUsers;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateUserRole(adminSession, userId, newRole) {
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$requireRole$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])(adminSession, "admin"); // Restrict to admins only
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].user.update({
            where: {
                id: userId
            },
            data: {
                role: newRole
            }
        });
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deleteUser(adminSession, userId) {
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$requireRole$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])(adminSession, "admin"); // Restrict to admins only
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].user.delete({
            where: {
                id: userId
            }
        });
        return {
            success: true
        };
    } catch (error) {
        return {
            error: error
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateGlobalSettings,
    fetchUsers,
    updateUserRole,
    deleteUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateGlobalSettings, "60d7caf4c34c68298806ec8c469ac629fc494ef713", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchUsers, "40e4be2460b9fc8133f79cf220f9b4e530f4ab891a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserRole, "7047e49ae936daefad9e6564922da49085f02cc24c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteUser, "60ed96673b12aa179b12549bd6b3a4aa642d16f1b5", null);
}}),
"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"00f4c7477b95e20dbcc103947836bc8ba9806c04ad":"getReportTypes"} */ __turbopack_context__.s({
    "getReportTypes": (()=>getReportTypes)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getReportTypes() {
    // Fetch the report types from the database.
    const types = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].reportType.findMany();
    // Map the result to a simpler array of objects if needed.
    return types.map((type)=>({
            id: type.id,
            name: type.name,
            fields: type.fields
        }));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getReportTypes
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReportTypes, "00f4c7477b95e20dbcc103947836bc8ba9806c04ad", null);
}}),
"[project]/actions/getReports.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40b27db475edb8debc13ddf78a81dbb51ec30d0dc0":"getReports"} */ __turbopack_context__.s({
    "getReports": (()=>getReports)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getReports(timeRange = 4) {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - timeRange);
    // Fetch the report types from the database.
    const reports = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.findMany({
        where: {
            createdAt: {
                gte: cutoffTime
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            votes: {
                where: {
                    value: 1
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 1
            }
        }
    });
    // Map the result to a simpler array of objects if needed.
    return reports.map((report)=>({
            ...report,
            lastSighting: report.votes.length > 0 ? report.votes[0].createdAt : null
        }));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getReports
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReports, "40b27db475edb8debc13ddf78a81dbb51ec30d0dc0", null);
}}),
"[project]/actions/postReport.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"4067a203f2b3ae0098604c9bdcad336d76b680c541":"postReport","40a6ca9e00c27194e167ed4d8740ecd752ac88d619":"handleDeletedUser"} */ __turbopack_context__.s({
    "handleDeletedUser": (()=>handleDeletedUser),
    "postReport": (()=>postReport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ postReport(payload) {
    try {
        const { latitude, longitude, reportTypeId, trustScore, userId, description = {} } = payload;
        const image = null;
        const report = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.create({
            data: {
                lat: latitude,
                long: longitude,
                description: Object.keys(description).length ? description : __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["Prisma"].JsonNull,
                image: image ?? null,
                trustScore,
                submittedById: userId || null,
                reportTypeId
            }
        });
        console.log("Report posted:", report);
        // Emit new report event via WebSocket
        await fetch("http://localhost:3005/api/new-report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(report)
        });
        return report;
    } catch (error) {
        console.error("Error posting report", error);
        return {
            error: "Failed to post report"
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ handleDeletedUser(userId) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.updateMany({
            where: {
                submittedById: userId
            },
            data: {
                deletedUserId: userId
            }
        });
    } catch (error) {
        console.error("Error deleting user", error);
        return {
            error: "Failed to delete user"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    postReport,
    handleDeletedUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(postReport, "4067a203f2b3ae0098604c9bdcad336d76b680c541", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleDeletedUser, "40a6ca9e00c27194e167ed4d8740ecd752ac88d619", null);
}}),
"[externals]/console [external] (console, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("console", () => require("console"));

module.exports = mod;
}}),
"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40fe745472845a1892c6f058eae469d31a64802285":"validateInvite"} */ __turbopack_context__.s({
    "validateInvite": (()=>validateInvite)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)"); // Adjust path based on your project structure
var __TURBOPACK__imported__module__$5b$externals$5d2f$console__$5b$external$5d$__$28$console$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/console [external] (console, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ validateInvite(inviteCode) {
    try {
        if (!inviteCode) return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$console__$5b$external$5d$__$28$console$2c$__cjs$29$__["error"])("Invite code is required");
        // Check if the invite code exists in the database
        const invite = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].inviteCode.findUnique({
            where: {
                code: inviteCode,
                isUsed: false
            }
        });
        if (!invite) {
            return "Invalid or previously used invite code";
        }
        // If the code is valid, return success
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].inviteCode.update({
            where: {
                code: inviteCode
            },
            data: {
                isUsed: true
            }
        });
        return true;
    } catch (error) {
        console.error("Error validating invite code:", error);
        return false;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    validateInvite
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(validateInvite, "40fe745472845a1892c6f058eae469d31a64802285", null);
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
;
;
;
;
;
;
;
;
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/globalSettings.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/adminActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getReports.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/postReport.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/validateInvite.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGlobalSettings"]),
    "00f4c7477b95e20dbcc103947836bc8ba9806c04ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReportTypes"]),
    "4067a203f2b3ae0098604c9bdcad336d76b680c541": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["postReport"]),
    "40a6ca9e00c27194e167ed4d8740ecd752ac88d619": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleDeletedUser"]),
    "40b27db475edb8debc13ddf78a81dbb51ec30d0dc0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReports"]),
    "40e4be2460b9fc8133f79cf220f9b4e530f4ab891a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchUsers"]),
    "40fe745472845a1892c6f058eae469d31a64802285": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateInvite"]),
    "60d7caf4c34c68298806ec8c469ac629fc494ef713": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateGlobalSettings"]),
    "60ed96673b12aa179b12549bd6b3a4aa642d16f1b5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteUser"]),
    "7047e49ae936daefad9e6564922da49085f02cc24c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserRole"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/globalSettings.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/adminActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getReports.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/postReport.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/validateInvite.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0"]),
    "00f4c7477b95e20dbcc103947836bc8ba9806c04ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00f4c7477b95e20dbcc103947836bc8ba9806c04ad"]),
    "4067a203f2b3ae0098604c9bdcad336d76b680c541": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4067a203f2b3ae0098604c9bdcad336d76b680c541"]),
    "40a6ca9e00c27194e167ed4d8740ecd752ac88d619": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40a6ca9e00c27194e167ed4d8740ecd752ac88d619"]),
    "40b27db475edb8debc13ddf78a81dbb51ec30d0dc0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40b27db475edb8debc13ddf78a81dbb51ec30d0dc0"]),
    "40e4be2460b9fc8133f79cf220f9b4e530f4ab891a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40e4be2460b9fc8133f79cf220f9b4e530f4ab891a"]),
    "40fe745472845a1892c6f058eae469d31a64802285": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40fe745472845a1892c6f058eae469d31a64802285"]),
    "60d7caf4c34c68298806ec8c469ac629fc494ef713": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60d7caf4c34c68298806ec8c469ac629fc494ef713"]),
    "60ed96673b12aa179b12549bd6b3a4aa642d16f1b5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60ed96673b12aa179b12549bd6b3a4aa642d16f1b5"]),
    "7047e49ae936daefad9e6564922da49085f02cc24c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["7047e49ae936daefad9e6564922da49085f02cc24c"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__518cabb3._.js.map