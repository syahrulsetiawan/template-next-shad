/**
 * USAGE EXAMPLES - User Config Hooks
 *
 * File ini berisi contoh penggunaan hooks untuk manage user configuration
 */

// ============================================================================
// Example 1: Display Current Theme
// ============================================================================
import {useUserConfig} from '@/hooks/useUserConfig';

function ThemeDisplay() {
  const {config} = useUserConfig();

  if (!config) return null;

  return (
    <div>
      <p>Current Theme: {config.dark_mode}</p>
      <p>Language: {config.language}</p>
      <p>Menu Layout: {config.menu_layout}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Theme Toggle Button
// ============================================================================
function ThemeToggleButton() {
  const {config, toggleDarkMode, isUpdating} = useUserConfig();

  return (
    <button onClick={toggleDarkMode} disabled={isUpdating}>
      {isUpdating ? 'Updating...' : `Current: ${config?.dark_mode}`}
    </button>
  );
}

// ============================================================================
// Example 3: Language Selector
// ============================================================================
function LanguageSelector() {
  const {config, setLanguage, isUpdating} = useUserConfig();

  const languages = [
    {code: 'en', name: 'English'},
    {code: 'id', name: 'Indonesia'},
    {code: 'ar', name: 'العربية'}
  ];

  return (
    <select
      value={config?.language || 'en'}
      onChange={(e) => setLanguage(e.target.value)}
      disabled={isUpdating}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// Example 4: Settings Page
// ============================================================================
function SettingsPage() {
  const {
    config,
    toggleDarkMode,
    toggleRTL,
    setMenuLayout,
    setContentWidth,
    toggleEmailNotifications,
    isUpdating
  } = useUserConfig();

  if (!config) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1>Settings</h1>

      {/* Theme */}
      <div>
        <label>Dark Mode</label>
        <button onClick={toggleDarkMode} disabled={isUpdating}>
          {config.dark_mode}
        </button>
      </div>

      {/* RTL */}
      <div>
        <label>Right-to-Left</label>
        <input
          type="checkbox"
          checked={config.rtl}
          onChange={toggleRTL}
          disabled={isUpdating}
        />
      </div>

      {/* Menu Layout */}
      <div>
        <label>Menu Layout</label>
        <select
          value={config.menu_layout}
          onChange={(e) =>
            setMenuLayout(e.target.value as 'vertical' | 'horizontal')
          }
          disabled={isUpdating}
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </div>

      {/* Content Width */}
      <div>
        <label>Content Width</label>
        <select
          value={config.content_width}
          onChange={(e) => setContentWidth(e.target.value as 'full' | 'boxed')}
          disabled={isUpdating}
        >
          <option value="full">Full Width</option>
          <option value="boxed">Boxed</option>
        </select>
      </div>

      {/* Email Notifications */}
      <div>
        <label>Email Notifications</label>
        <input
          type="checkbox"
          checked={config.email_notifications}
          onChange={toggleEmailNotifications}
          disabled={isUpdating}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Custom Update
// ============================================================================
function CustomConfigUpdate() {
  const {updateConfig, isUpdating} = useUserConfig();

  const handleBulkUpdate = () => {
    updateConfig({
      dark_mode: 'dark',
      language: 'id',
      menu_layout: 'horizontal'
    });
  };

  return (
    <button onClick={handleBulkUpdate} disabled={isUpdating}>
      Apply Custom Theme
    </button>
  );
}

// ============================================================================
// Example 6: Read-only Config Access
// ============================================================================
function ConfigDisplay() {
  const {config} = useUserConfig();

  // Safe access dengan optional chaining
  const isDark = config?.dark_mode === 'dark';
  const isRTL = config?.rtl ?? false;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isDark ? 'dark' : 'light'}>
      {/* Your content */}
    </div>
  );
}

export {
  ThemeDisplay,
  ThemeToggleButton,
  LanguageSelector,
  SettingsPage,
  CustomConfigUpdate,
  ConfigDisplay
};
