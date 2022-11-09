const sanityClient = require("@sanity/client");

module.exports = { handler };
{
  client = sanityClient({
    projectId: process.env.SANITY_PROJECT,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: "2022-01-01",
    useCdn: false,
  });
}
