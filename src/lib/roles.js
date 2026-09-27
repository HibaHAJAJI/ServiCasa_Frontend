export const ROLES = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  ARTISAN: "ARTISAN",
};

const KNOWN_ROLES = Object.values(ROLES);

export const ROLE_HOME = {
  [ROLES.ARTISAN]: "/dashboard/artisan",
  [ROLES.CLIENT]: "/client/dashboard",
  [ROLES.ADMIN]: "/dashboard/admin",
};

export const normalizeRole = (role) => {
  if (typeof role !== "string" || role.length === 0) {
    return null;
  }
  const normalized = role.toUpperCase().replace(/^ROLE_/, "");
  return KNOWN_ROLES.includes(normalized) ? normalized : null;
};

export const getRole = (user) => normalizeRole(user?.role);

export const isAdmin = (user) => getRole(user) === ROLES.ADMIN;

export const isNotificationRecipient = (user) => {
  const role = getRole(user);
  return role === ROLES.CLIENT || role === ROLES.ARTISAN;
};
