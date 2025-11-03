// types.ts

/** Tipe untuk konfigurasi pengguna (dark_mode, language, dll.) */
export interface UserConfig {
  id: number;
  user_id: string;
  config_key: string;
  config_value: string;
  created_at: string;
  updated_at: string;
}

/** Tipe untuk Tenant (Penyewa) */
export interface Tenant {
  id: string;
  name: string;
  code: string;
  domain: string | null;
  logo_path: string | null;
  address: string | null;
  country: string | null;
  province: string | null;
  city: string | null;
  postal_code: string | null;
  is_active: 0 | 1;
  status: 'trial' | string;
  joined_at: string;
  expired_at: string | null;
  revoked_at: string | null;
  maximal_failed_login_attempts: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pivot: {
    user_id: string;
    tenant_id: string;
  };
}

/** Tipe untuk data pengguna utama (seperti dari /api/me) */
export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  profile_photo_path: string | null;
  failed_login_attempts: number;
  last_tenant_id: string | null;
  last_service_key: string | null;
  is_locked: 0 | 1;
  locked_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tenants: Tenant[];
  configs: UserConfig[];
}
