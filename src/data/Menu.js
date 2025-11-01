import {
  Building,
  Download,
  History,
  MapPin,
  PieChart,
  Settings,
  SlidersHorizontal,
  UserRoundCog,
  Users,
  Workflow
} from 'lucide-react';

export const menu = [
  {
    title: 'dashboard',
    url: '/admin-portal',
    icon: PieChart,
    is_owner_only: false
  },
  {
    title: 'company_settings',
    url: '/admin-portal/company-settings',
    icon: SlidersHorizontal,
    is_owner_only: true
  },
  {
    title: 'company_operational_zone_settings',
    url: '/admin-portal/operational_zone-settings',
    icon: MapPin,
    is_owner_only: true
  },
  {
    title: 'company_branches_settings',
    url: '/admin-portal/branches-settings',
    icon: Building,
    is_owner_only: true
  },
  {
    title: 'users_settings',
    url: '/admin-portal/users-settings',
    icon: Users,
    is_owner_only: false
  },
  {
    title: 'roles_settings',
    url: '/admin-portal/roles-settings',
    icon: UserRoundCog,
    is_owner_only: false
  },
  {
    title: 'master_data_settings',
    url: '/admin-portal/master-data-settings',
    icon: Settings,
    is_owner_only: false
  },
  {
    title: 'modules',
    url: '#',
    icon: Workflow,
    is_owner_only: true,
    items: [
      {
        title: 'workflow_management',
        url: '/admin-portal/workflow-management'
      },
      {
        title: 'states_management',
        url: '/admin-portal/states-management'
      },
      {
        title: 'autonumber_management',
        url: '/admin-portal/autonumber-management'
      }
    ]
  },
  {
    title: 'audit_logs',
    url: '/admin-portal/audit-logs',
    icon: History,
    is_owner_only: true
  },
  {
    title: 'download_database_backup',
    url: '/admin-portal/download-database-backup',
    icon: Download,
    is_owner_only: true
  }
];
