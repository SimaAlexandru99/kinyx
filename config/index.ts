export const config = {
  // Internationalization
  i18n: {
    enabled: true,
    locales: {
      en: {
        currency: "USD",
        label: "English",
      },
      ro: {
        currency: "RON",
        label: "Română",
      },
    },
    defaultLocale: "en",
    defaultCurrency: "USD",
    localeCookieName: "NEXT_LOCALE",
  },

  // Organizations
  organizations: {
    enable: true,
    enableBilling: true,
    hideOrganization: false,
    enableUsersToCreateOrganizations: true,
    requireOrganization: false,
    avatarColors: ["#4e6df5", "#e5a158", "#9dbee5", "#ced3d9"],
    forbiddenOrganizationSlugs: [
      "new-organization",
      "admin",
      "settings",
      "ai-demo",
      "api",
      "auth",
    ],
  },

  // Users
  users: {
    enableBilling: true,
    enableOnboarding: false,
  },

  // Authentication
  auth: {
    enableSignup: true,
    enableMagicLink: true,
    enableSocialLogin: true,
    enablePasskeys: true,
    enablePasswordLogin: true,
    redirectAfterSignIn: "/app",
    redirectAfterLogout: "/",
    sessionCookieMaxAge: 60 * 60 * 24 * 30, // 30 days
  },

  // Mails
  mails: {
    from: "hello@your-domain.com",
  },

  // Frontend
  ui: {
    enabledThemes: ["light", "dark"],
    defaultTheme: "light",
    saas: {
      enabled: true,
      useSidebarLayout: true,
    },
    marketing: {
      enabled: true,
    },
  },

  // Storage
  storage: {
    bucketNames: {
      avatars: process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME ?? "avatars",
    },
  },

  // Contact form
  contactForm: {
    enabled: true,
    to: "hello@your-domain.com",
    subject: "New contact form submission",
  },

  // Payments
  payments: {
    plans: {
      // Define your plans here
    },
  },
} as const;

export type Config = typeof config;
