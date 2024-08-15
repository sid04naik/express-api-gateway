export default {
	testEnvironment: "node",
	testEnvironmentOptions: {
		NODE_ENV: "test",
	},
	restoreMocks: true,
	coveragePathIgnorePatterns: ["node_modules", "data", "conf", "src/config", "index.js", "tests"],
	coverageReporters: ["text", "lcov", "clover", "html"],
};
