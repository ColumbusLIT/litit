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
  // TODO has local host issues due to cookies and CORS
  const { identity, user } = context.clientContext;
  console.log(identity,user)
  const uid = event.queryStringParameters.uid;

  if (!context.clientContext && !context.clientContext.identity) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Access denied" }),
    }
  }
  if (!uid) {
  /* no user, no go */
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no user",
      }),
    };
  }
  try {
    const query = `*[_type == "note" && references("${uid}")]{title, content, image, domain, preset, status, dateFrom, dateTo, user, _updatedAt, _id}`;

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
          user: n.user,
          updated: n._updatedAt,
          id: n._id,
        };
      });
    });
    console.log(notes)

    return {
      statusCode: 200,
      // headers: {
      //   "Content-Type": "application/json",
      //   "access-control-allow-origin": "http://localhost:3000",
      // },
      body: JSON.stringify(notes),
    };
  } catch (error) {
    console.log(error);
    return {
      // headers: {
      //   "Content-Type": "application/json",
      //   "access-control-allow-origin": "http://localhost:3000",
      // },
      statusCode: 500,
      body:
        error.responseBody || JSON.stringify({ error: "An error occurred" }),
    };
  }
};

module.exports = { handler };
