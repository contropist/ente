import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Ente Help",
    description: "Documentation and help for Ente's products",
    head: [["link", { rel: "icon", type: "image/png", href: "/favicon.png" }]],
    cleanUrls: true,
    themeConfig: {
        // We use the default theme (with some CSS color overrides). This
        // themeConfig block can be used to further customize the default theme.
        //
        // https://vitepress.dev/reference/default-theme-config
        logo: "/logo.png",
        externalLinkIcon: true,
        editLink: {
            pattern:
                "https://github.com/ente-io/ente/edit/main/docs/docs/:path",
        },
        // nav: [
        //     { text: "Photos", link: "/photos/index" },
        //     { text: "Authenticator", link: "/authenticator/index" },
        // ],
        search: {
            provider: "local",
            options: {
                detailedView: true,
            },
        },
        sidebar: sidebar,
        socialLinks: [
            { icon: "github", link: "https://github.com/ente-io/ente/" },
            { icon: "twitter", link: "https://twitter.com/enteio" },
            { icon: "discord", link: "https://discord.gg/z2YVKkycX3" },
        ],
    },
});
