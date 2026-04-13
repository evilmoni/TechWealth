const { createClient } = require("@sanity/client");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

const projectId = requireEnv("SANITY_PROJECT_ID");
const dataset = requireEnv("SANITY_DATASET");
const apiVersion = process.env.SANITY_API_VERSION || "2026-04-01";
const token = process.env.SANITY_API_TOKEN;

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !token, // private datasets require token and no CDN
  token,
});

module.exports = { sanityClient };

