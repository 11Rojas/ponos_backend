export enum ErrorCodes {
    // Auth Errors (1xx)
    UNAUTHORIZED = 101,
    INVALID_TOKEN = 102,
    TOKEN_EXPIRED = 103,
    INVALID_CREDENTIALS = 104,

    // User Errors (2xx)
    USER_NOT_FOUND = 201,
    USER_INACTIVE = 202,
    EMAIL_NOT_VERIFIED = 203,
    INVALID_EMAIL = 204,

    // IP Errors (3xx)
    IP_NOT_RECOGNIZED = 301,
    IP_VERIFICATION_REQUIRED = 302,
    IP_VERIFICATION_PENDING = 303,

    // Server Errors (5xx)
    INTERNAL_ERROR = 501,
    DATABASE_ERROR = 502,
    REDIS_ERROR = 503
} 