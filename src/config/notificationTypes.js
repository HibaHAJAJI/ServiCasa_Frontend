import { ROLES } from "../lib/roles.js";

export const NOTIFICATION_RECIPIENT_ROLES = {
  NOUVELLE_DEMANDE: [ROLES.ARTISAN],
  DEMANDE_ACCEPTEE: [ROLES.CLIENT],
  DEMANDE_REFUSEE: [ROLES.CLIENT],
  INTERVENTION_TERMINEE: [ROLES.CLIENT],
  RESERVATION_ANNULEE: [ROLES.ARTISAN],
  PAIEMENT_CONFIRME: [ROLES.CLIENT],
};

export const isNotificationAllowedForRole = (type, role) => {
  if (role !== ROLES.CLIENT && role !== ROLES.ARTISAN) {
    return false;
  }
  const allowedRoles = NOTIFICATION_RECIPIENT_ROLES[type];
  if (!allowedRoles) {
    return true;
  }
  return allowedRoles.includes(role);
};
