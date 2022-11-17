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

  const uId = context.clientContext.user.sub
  const uRoles = context.clientContext.user.app_metadata.roles
  
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

  try {
    const query = `*[_type=="note" && references($uId)]{title, content, image, domain, preset, status, dateFrom, dateTo, belongsTo->, _updatedAt, _id}`;

    let notes;

    await client.fetch(query).then((r) => {
      notes = r.map((n) => {
        return {
          title: n.title,
          content: n.content,
          image: n.image,
          domain: n.domain,
          preset: n.preset,
          status: n.status,
          dateFrom: n.dateFrom,
          dateTo: n.dateTo,
          belongsTo: n.belongsTo,
          updated: n._updatedAt,
          id: n._id,
        };
      });
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
      body: JSON.stringify(notes[0]),
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
