// types.ts

/** Tipe untuk konfigurasi pengguna (dark_mode, language, dll.) */
export interface UserConfig {
  rtl: boolean;
  language: string;
  content_width: 'full' | 'boxed';
  dark_mode: 'light' | 'dark' | 'by_system';
  email_notifications: boolean;
  menu_layout: 'vertical' | 'horizontal';
}

/** Tipe untuk konfigurasi tenant */
export interface TenantConfig {
  id: string;
  configKey: string;
  configValue: string;
  configType: 'string' | 'number' | 'boolean' | 'select';
}

/** Tipe untuk Tenant (Penyewa) */
export interface TenantDetail {
  id: string;
  name: string;
  code: string;
  logoPath: string | null;
  status: 'trial' | 'active' | 'suspended' | 'expired';
  isActive: boolean;
  configs: TenantConfig[];
}

/** Tipe untuk relasi user-tenant */
export interface UserTenant {
  tenantId: string;
  isActive: boolean;
  isOwner: boolean;
  tenant: TenantDetail;
}

/** Tipe untuk data pengguna utama (seperti dari /api/me) */
export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  profilePhotoPath: string | null;
  failedLoginCounter: number;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  lastTenantId: string | null;
  lastServiceKey: string | null;
  isLocked: boolean;
  temporaryLockUntil: string | null;
  forceLogoutAt: string | null;
  lockedAt: string | null;
  rememberToken: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user_config?: UserConfig; // From /me endpoint
  userConfigs?: UserConfig[]; // Legacy support
  tenants: UserTenant[];
  detailCurrentTenant?: any; // Add if needed
}

/** Tipe untuk response login */
export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: UserData;
  };
  timestamp: string;
}

/** Tipe untuk response /me */
export interface MeResponse {
  success: boolean;
  data: UserData;
  timestamp: string;
}

export interface userConfigRequest {
  rtl: boolean;
  language: 'id' | 'en';
  content_width: 'full' | 'compact';
  dark_mode: 'light' | 'dark' | 'by_system';
  email_notifications: boolean;
  menu_layout: 'vertical' | 'horizontal';
}
