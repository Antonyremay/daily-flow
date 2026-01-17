export default defineConfig(({ mode }) => ({
  // ❌ REMOVE base: "/daily-flow/",

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
