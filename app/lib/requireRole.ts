import type { Session } from "@/app/lib/auth-client";

export const requireRole = (
  session: Session,
  requiredRole: "user" | "moderator" | "admin"
) => {
  console.log("Session in requireRole:", session);
  if (
    !session ||
    typeof session !== "object" ||
    !("user" in session) ||
    !session.user
  ) {
    throw new Error("User is not authenticated");
  }

  const rolesHierarchy = { user: 1, moderator: 2, admin: 3 };

  if (rolesHierarchy[session.user.role] < rolesHierarchy[requiredRole]) {
    throw new Error(`User does not have the required role: ${requiredRole}`);
  }
};
