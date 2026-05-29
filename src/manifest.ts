import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "ReLeet",
  version: "1.0.0",

  permissions: [
    "storage",
    "tabs",
    "alarms",
    "notifications"
  ],

  host_permissions: [
    "https://leetcode.com/*"
  ],

  action: {
    default_title: "ReLeet",
    default_popup: "popup.html"
  },

  options_page: "index.html",

  background: {
  service_worker:
    "src/background/background.ts",
  type: "module",
},

  content_scripts: [
    {
      matches: [
        "https://leetcode.com/problems/*"
      ],

      js: [
        "src/content/main.tsx"
      ]
    }
  ]
});