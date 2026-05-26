import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "LeetCode Reviser",
  version: "1.0.0",

  permissions: ["storage"],

  host_permissions: [
    "https://leetcode.com/*"
  ],

  content_scripts: [
    {
      matches: ["https://leetcode.com/problems/*"],
      js: ["src/content/main.tsx"]
    }
  ]
});