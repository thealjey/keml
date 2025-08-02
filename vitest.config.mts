import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ["src/*.mts"],
      reporter: "html",
      all: true,
      clean: true,
      thresholds: { 100: true },
    },
    setupFiles: "src/test_setup.ts",
    includeSource: ["src/*.mts"],
    environment: "happy-dom",
  },
});
