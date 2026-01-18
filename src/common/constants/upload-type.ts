export const UPLOAD_TYPE = {
    AVATAR: 'AVATAR',
    POST: 'POST',
} as const;

export type UploadType =
    typeof UPLOAD_TYPE[keyof typeof UPLOAD_TYPE];
