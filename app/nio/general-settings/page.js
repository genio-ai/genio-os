"use client";
import { useState } from "react";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: true,
    language: "en",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">General Settings</h1>

      <div className="space-y-6 max-w-lg">
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <select
            value={settings.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleChange("notifications", e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Language</span>
          <select
            value={settings.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-md py-2 font-semibold"
        >
          Save Settings
        </button>

        {saved && (
          <p className="text-green-400 text-sm text-center">Settings saved successfully!</p>
        )}
      </div>
    </main>
  );
}
