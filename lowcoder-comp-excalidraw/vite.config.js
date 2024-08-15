import config from "lowcoder-cli/config/vite.config";
export default {
  ...config,
  define: {
    ...config.define,
    "process.env.IS_PREACT": JSON.stringify(true),
  },
  server: {
    open: true,
    port: 9000,
  },
};
