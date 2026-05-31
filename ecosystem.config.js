/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "mist-haven",
      // Standalone deploy: requires postbuild (public + .next/static in .next/standalone)
      script: ".next/standalone/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
