import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      clean: true,
      enabled: true,
      exclude: ["src/**/*.{test,e}.mts"],
      include: ["src/**/*.mts"],
      reporter: "html",
      thresholds: { 100: true },
    },
    environment: "happy-dom",
    includeSource: ["src/**/*.mts"],
  },
});
