const userAgent = process.env.npm_config_user_agent || "";

if (userAgent.includes("npm")) {
  console.error(`
❌ ERROR: npm is not supported for this project.

Please use Yarn:

  yarn install
`);
  process.exit(1);
}

if (userAgent.includes("pnpm")) {
  console.error(`
❌ ERROR: pnpm is not supported for this project.

Please use Yarn:

  yarn install
`);
  process.exit(1);
}
