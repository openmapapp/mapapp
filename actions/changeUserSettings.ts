"use server";

import db from "../db";

export async function changeUsername(userId, accountId, username) {
    try {
        const userPermissions = await db.user.findUnique({
            where: {
                id: userId,
            },
        })


    }
}

export async function changePassword(userId, accountId, currentPassword, newPassword) {

}

export async function deleteUser(userId, accountId, password) {

}
