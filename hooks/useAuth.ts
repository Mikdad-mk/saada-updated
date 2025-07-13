import { useSession } from "next-auth/react";
import { UserRole } from "@/app/api/auth/[...nextauth]/route";

export function useAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = !!session?.user;
  const user = session?.user;
  const role = session?.user?.role as UserRole;

  const isAdmin = role === UserRole.ADMIN;
  const isModerator = role === UserRole.MODERATOR;
  const isUser = role === UserRole.USER;

  const hasRole = (requiredRole: UserRole) => {
    if (!isAuthenticated) return false;
    
    switch (requiredRole) {
      case UserRole.ADMIN:
        return isAdmin;
      case UserRole.MODERATOR:
        return isAdmin || isModerator;
      case UserRole.USER:
        return isAuthenticated;
      default:
        return false;
    }
  };

  const hasAnyRole = (requiredRoles: UserRole[]) => {
    return requiredRoles.some(role => hasRole(role));
  };

  const canAccessAdmin = () => hasRole(UserRole.ADMIN);
  const canAccessModerator = () => hasRole(UserRole.MODERATOR) || hasRole(UserRole.ADMIN);
  const canManageUsers = () => hasRole(UserRole.ADMIN);
  const canManageQuizzes = () => hasRole(UserRole.ADMIN) || hasRole(UserRole.MODERATOR);
  const canViewAnalytics = () => hasRole(UserRole.ADMIN) || hasRole(UserRole.MODERATOR);

  return {
    session,
    status,
    user,
    role,
    isAuthenticated,
    isAdmin,
    isModerator,
    isUser,
    hasRole,
    hasAnyRole,
    canAccessAdmin,
    canAccessModerator,
    canManageUsers,
    canManageQuizzes,
    canViewAnalytics,
  };
} 