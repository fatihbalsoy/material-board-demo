import {
  startPlaygroundWeb,
} from "@wp-playground/client";

import "./style.css";

export async function main() {
  const root = document.getElementById("root");
  const iframe = render(root);

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
        {
          step: "mkdir",
          path: "/wordpress/wp-md"
        },
        {
          step: "writeFile",
          path: "/wordpress/wp-md/material-dashboard.zip",
          data: {
            resource: "url",
            url: "/demo/wp-material-design/material-dashboard.zip",
            caption: "Downloading Material Dashboard"
          },
          progress: {
            weight: 2,
            caption: "Applying Material Dashboard"
          }
        },
        {
          step: "unzip",
          zipPath: "/wordpress/wp-md/material-dashboard.zip",
          extractToPath: "/wordpress/wp-md"
        },
        {
          step: "installPlugin",
          pluginZipFile: {
            resource: "vfs",
            path: "/wordpress/wp-md/material-dashboard.zip"
          }
        }
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
