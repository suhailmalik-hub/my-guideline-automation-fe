module.exports = {
  apps: [
    {
      name: "guideline-frontend",
      script: "npm",
      args: "run preview -- --host 0.0.0.0 --port 3002",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3002,
      },

      // Performance and reliability settings
      max_memory_restart: "512M",
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,

      // Auto-restart settings
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "10s",

      // Graceful shutdown
      kill_timeout: 5000,
    },
  ],
};
