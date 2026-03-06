import { useTheme } from "../theme/ThemeContext";
import { useAuth } from "../auth/useAuth";

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-2">Account</div>
          <button
            type="button"
            className="w-full text-left text-gray-400"
            disabled
          >
            Change password (coming soon)
          </button>
          <button
            type="button"
            className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-3">Display</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex-1 rounded-lg px-3 py-2 text-sm border border-gray-200 display-btn display-light"
              onClick={() => setTheme("light")}
            >
              Light mode
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg px-3 py-2 text-sm border border-gray-200 display-btn display-dark"
              onClick={() => setTheme("dark")}
            >
              Dark mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
