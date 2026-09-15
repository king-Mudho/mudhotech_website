export const ADMIN_SESSION_COOKIE = "mudhotech_admin_session";
export const ADMIN_REFRESH_COOKIE = "mudhotech_admin_refresh";

export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8h — matches SIMPLE_JWT ACCESS_TOKEN_LIFETIME
export const ADMIN_REFRESH_MAX_AGE = 60 * 60 * 24 * 14; // 14d — matches SIMPLE_JWT REFRESH_TOKEN_LIFETIME
