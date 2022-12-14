const process = require("process");

const sanityClient = require("@sanity/client");

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: "2022-01-01",
  useCdn: false,
});

const handler = async (event, context) => {
  const id = event.queryStringParameters.id;

  const uId = context.clientContext.user.sub;
  const uRoles = context.clientContext.user.app_metadata.roles;

  /* no user, no go */
  if (!uId) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no user",
      }),
    };
  }
  /* no basic role, no go */
  if (uRoles[0] !== "basic") {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no uRoles",
      }),
    };
  }
  /* no id, no go */
  if (!id) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no sanity user id",
      }),
    };
  }

  try {
    const query = `*[_id == "${id}"][0]{domain,email,fullName}`;

    let user;

    await client.fetch(query).then((r) => {
      user = { domain: r.domain, email: r.email, fullName: r.fullName };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
      statusCode: 500,
      body:
        error.responseBody || JSON.stringify({ error: "An error occurred" }),
    };
  }
};

module.exports = { handler };
