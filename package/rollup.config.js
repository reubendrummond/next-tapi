import typescript from "@rollup/plugin-typescript";
// import resolve from "@rollup/plugin-node-resolve";
// import commonJs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/client/index.ts",
    output: {
      file: "dist/client.js",
      format: "cjs",
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
  {
    input: "src/server/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
];
