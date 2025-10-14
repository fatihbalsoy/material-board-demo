import {
  startPlaygroundWeb,
} from "@wp-playground/client";

import "./style.css";

export async function main() {
  const root = document.getElementById("root");
  const iframe = render(root);
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = isDarkMode ? "'dark'" : "'light'";

  const playground = await startPlaygroundWeb({
    iframe,
    remoteUrl: "https://playground.wordpress.net/remote.html",
    blueprint: {
      landingPage: "/wp-admin/",
      preferredVersions: {
        php: "8.0",
        wp: "latest",
      },
      steps: [
        {
          "step": "runPHP",
          "code": `<?php require_once 'wordpress/wp-load.php'; update_option('fbwpmdp_theme', ${theme}); ?>`
        },
        { step: "login", username: "admin", password: "password" },
        {
          step: "setSiteOptions",
          options: {
            WPLANG: "en",
            permalink_structure: "/%postname%/",
            gp_enable_local_translation: 1,
            gp_enable_inline_translation: 1,
          },
        },
        {
          step: "updateUserMeta",
          meta: {
            show_welcome_panel: "1",
          },
          userId: 1,
        },

        // Local:
        {
          "step": "installPlugin",
          "pluginZipFile": {
            "resource": "url",
            "url": "/material-board.zip"
          }
        },

        // CORS issue:
        // {
        //   "step": "installPlugin",
        //   "pluginZipFile": {
        //     "resource": "url",
        //     "url": "https://github.com/fatihbalsoy/material-board/archive/refs/heads/release-deployed.zip"
        //   }
        // },

        // No longer maintained:
        // {
        //   "step": "installPlugin",
        //   "pluginZipFile": {
        //     "resource": "wordpress.org/plugins",
        //     "slug": "material-board"
        //   }
        // },
      ],
    },
  });
}

/**
 *
 * @param {HTMLElement} el
 */
function render(el) {
  const iframe = document.createElement("iframe");
  iframe.title = "Playground Viewport";
  iframe.className = "playground__viewport--full-size";
  el.appendChild(iframe);
  return iframe;
}
