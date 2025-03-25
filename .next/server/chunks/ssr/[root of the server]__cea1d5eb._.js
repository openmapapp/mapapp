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
"[project]/actions/deleteReport.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"6072878db97e1d4c40d579b813a1f4c096eb94660c":"deleteReport"} */ __turbopack_context__.s({
    "deleteReport": (()=>deleteReport)
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
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deleteReport(reportId, session) {
    try {
        if (!session) return {
            error: "Unauthorized: No user session"
        };
        const reportIdNumber = Number(reportId);
        const report = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.findUnique({
            where: {
                id: reportIdNumber
            }
        });
        if (!report) return {
            error: "Report not found"
        };
        const isOwner = report.submittedById === session.user.id;
        if (!isOwner) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$requireRole$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])(session, "moderator");
        } else {
            return {
                error: "Unauthorized"
            };
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.delete({
            where: {
                id: reportIdNumber
            }
        });
        return {
            success: true
        };
    } catch (error) {
        console.error(error);
        return {
            error: "Error deleting report"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    deleteReport
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteReport, "6072878db97e1d4c40d579b813a1f4c096eb94660c", null);
}}),
"[project]/actions/updateReport.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"70d4756192b48fe9a1b181174cfad5108811368c6b":"updateReport"} */ __turbopack_context__.s({
    "updateReport": (()=>updateReport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateReport(reportId, updatedData, session) {
    const report = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.findUnique({
        where: {
            id: reportId
        }
    });
    if (!report) throw new Error("Report not found");
    if (session.user.id !== report.submittedById && session.user.role !== "admin" && session.user.role !== "moderator") {
        throw new Error("Unauthorized");
    }
    return await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
        where: {
            id: reportId
        },
        data: {
            reportType: {
                connect: {
                    id: updatedData.reportTypeId
                }
            },
            description: updatedData?.dynamicFields ? JSON.stringify(updatedData.dynamicFields) : "{}"
        }
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateReport
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateReport, "70d4756192b48fe9a1b181174cfad5108811368c6b", null);
}}),
"[project]/actions/postVotes.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40a346a1026278e864abae708136859a5f25669b42":"voteOnReport"} */ __turbopack_context__.s({
    "voteOnReport": (()=>voteOnReport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ voteOnReport(payload) {
    const { userId, reportId, voteType } = payload;
    try {
        if (!reportId || !userId || !voteType) {
            console.error("Invalid payload:", payload);
            return {
                error: "Invalid payload"
            };
        }
        const existingVote = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].vote.findUnique({
            where: {
                userId_reportId: {
                    userId,
                    reportId
                }
            }
        });
        if (!existingVote) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].vote.create({
                data: {
                    userId,
                    reportId,
                    value: voteType
                }
            });
            if (voteType === 1) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
                    where: {
                        id: reportId
                    },
                    data: {
                        confirmationCount: {
                            increment: 1
                        }
                    }
                });
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
                    where: {
                        id: reportId
                    },
                    data: {
                        disconfirmationCount: {
                            increment: 1
                        }
                    }
                });
            }
        } else if (existingVote.value !== voteType) {
            // User switching votes
            await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].vote.update({
                where: {
                    userId_reportId: {
                        userId,
                        reportId
                    }
                },
                data: {
                    value: voteType
                }
            });
            if (voteType === 1) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
                    where: {
                        id: reportId
                    },
                    data: {
                        confirmationCount: {
                            increment: 1
                        },
                        disconfirmationCount: {
                            decrement: 1
                        }
                    }
                });
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
                    where: {
                        id: reportId
                    },
                    data: {
                        confirmationCount: {
                            decrement: 1
                        },
                        disconfirmationCount: {
                            increment: 1
                        }
                    }
                });
            }
        } else {
            // User clicked the same vote again to delete it
            await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].vote.delete({
                where: {
                    userId_reportId: {
                        userId,
                        reportId
                    }
                }
            });
            if (voteType === 1) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
                    where: {
                        id: reportId
                    },
                    data: {
                        confirmationCount: {
                            decrement: 1
                        }
                    }
                });
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
                    where: {
                        id: reportId
                    },
                    data: {
                        disconfirmationCount: {
                            decrement: 1
                        }
                    }
                });
            }
        }
        const updatedReport = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.findUnique({
            where: {
                id: reportId
            }
        });
        if (updatedReport && updatedReport.disconfirmationCount >= 5) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].report.update({
                where: {
                    id: reportId
                },
                data: {
                    isVisible: false
                }
            });
        }
        return {
            success: true
        };
    } catch (error) {
        console.error("Error voting on report:", error);
        return {
            error: "Failed to vote on report"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    voteOnReport
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(voteOnReport, "40a346a1026278e864abae708136859a5f25669b42", null);
}}),
"[project]/actions/getUserVote.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"60744b0a65037390c21970a8c19d41228540a200cb":"getUserVotes"} */ __turbopack_context__.s({
    "getUserVotes": (()=>getUserVotes)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getUserVotes(userId, reportId) {
    // Fetch the user's vote for this report.
    const userVote = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].vote.findUnique({
        where: {
            userId_reportId: {
                userId,
                reportId
            }
        }
    });
    if (!userVote) {
        return null;
    }
    // Map the result to a simpler array of objects if needed.
    return userVote;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUserVotes
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserVotes, "60744b0a65037390c21970a8c19d41228540a200cb", null);
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/actions/deleteReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/actions/updateReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/actions/postVotes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/actions/getUserVote.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
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
;
;
;
;
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/actions/deleteReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/actions/updateReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/actions/postVotes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/actions/getUserVote.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/deleteReport.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/updateReport.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/postVotes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getUserVote.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/actions/deleteReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/actions/updateReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE8 => "[project]/actions/postVotes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE9 => "[project]/actions/getUserVote.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/actions/deleteReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/actions/updateReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/actions/postVotes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/actions/getUserVote.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGlobalSettings"]),
    "00f4c7477b95e20dbcc103947836bc8ba9806c04ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReportTypes"]),
    "4067a203f2b3ae0098604c9bdcad336d76b680c541": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["postReport"]),
    "40a346a1026278e864abae708136859a5f25669b42": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["voteOnReport"]),
    "40a6ca9e00c27194e167ed4d8740ecd752ac88d619": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleDeletedUser"]),
    "40b27db475edb8debc13ddf78a81dbb51ec30d0dc0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReports"]),
    "40e4be2460b9fc8133f79cf220f9b4e530f4ab891a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchUsers"]),
    "40fe745472845a1892c6f058eae469d31a64802285": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateInvite"]),
    "6072878db97e1d4c40d579b813a1f4c096eb94660c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteReport"]),
    "60744b0a65037390c21970a8c19d41228540a200cb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserVotes"]),
    "60d7caf4c34c68298806ec8c469ac629fc494ef713": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateGlobalSettings"]),
    "60ed96673b12aa179b12549bd6b3a4aa642d16f1b5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteUser"]),
    "7047e49ae936daefad9e6564922da49085f02cc24c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserRole"]),
    "70d4756192b48fe9a1b181174cfad5108811368c6b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateReport"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/globalSettings.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/adminActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getReports.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/postReport.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/validateInvite.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/deleteReport.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/updateReport.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/postVotes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/getUserVote.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/actions/deleteReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/actions/updateReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE8 => "[project]/actions/postVotes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE9 => "[project]/actions/getUserVote.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/globalSettings.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/actions/adminActions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/actions/getReports.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/actions/postReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/actions/validateInvite.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/actions/deleteReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/actions/updateReport.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/actions/postVotes.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/actions/getUserVote.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["000dbe54a7bfb9b0635ff4e984a74370b913fd1fe0"]),
    "00f4c7477b95e20dbcc103947836bc8ba9806c04ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00f4c7477b95e20dbcc103947836bc8ba9806c04ad"]),
    "4067a203f2b3ae0098604c9bdcad336d76b680c541": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4067a203f2b3ae0098604c9bdcad336d76b680c541"]),
    "40a346a1026278e864abae708136859a5f25669b42": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40a346a1026278e864abae708136859a5f25669b42"]),
    "40a6ca9e00c27194e167ed4d8740ecd752ac88d619": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40a6ca9e00c27194e167ed4d8740ecd752ac88d619"]),
    "40b27db475edb8debc13ddf78a81dbb51ec30d0dc0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40b27db475edb8debc13ddf78a81dbb51ec30d0dc0"]),
    "40e4be2460b9fc8133f79cf220f9b4e530f4ab891a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40e4be2460b9fc8133f79cf220f9b4e530f4ab891a"]),
    "40fe745472845a1892c6f058eae469d31a64802285": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40fe745472845a1892c6f058eae469d31a64802285"]),
    "6072878db97e1d4c40d579b813a1f4c096eb94660c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["6072878db97e1d4c40d579b813a1f4c096eb94660c"]),
    "60744b0a65037390c21970a8c19d41228540a200cb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60744b0a65037390c21970a8c19d41228540a200cb"]),
    "60d7caf4c34c68298806ec8c469ac629fc494ef713": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60d7caf4c34c68298806ec8c469ac629fc494ef713"]),
    "60ed96673b12aa179b12549bd6b3a4aa642d16f1b5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60ed96673b12aa179b12549bd6b3a4aa642d16f1b5"]),
    "7047e49ae936daefad9e6564922da49085f02cc24c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["7047e49ae936daefad9e6564922da49085f02cc24c"]),
    "70d4756192b48fe9a1b181174cfad5108811368c6b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["70d4756192b48fe9a1b181174cfad5108811368c6b"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/actions/deleteReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/actions/updateReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE8 => "[project]/actions/postVotes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE9 => "[project]/actions/getUserVote.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$globalSettings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$actions$2f$adminActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$actions$2f$getReportTypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$actions$2f$getReports$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$actions$2f$postReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$actions$2f$validateInvite$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$actions$2f$deleteReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$actions$2f$updateReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$actions$2f$postVotes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$actions$2f$getUserVote$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/globalSettings.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/actions/adminActions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/actions/getReportTypes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/actions/getReports.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/actions/postReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/actions/validateInvite.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/actions/deleteReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/actions/updateReport.ts [app-rsc] (ecmascript)", ACTIONS_MODULE8 => "[project]/actions/postVotes.ts [app-rsc] (ecmascript)", ACTIONS_MODULE9 => "[project]/actions/getUserVote.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
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
"[project]/app/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/page.tsx <module evaluation>", "default");
}}),
"[project]/app/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/page.tsx", "default");
}}),
"[project]/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/app/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__cea1d5eb._.js.map