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

  /* no user, no go */
  if (!uId) {
    console.log("No user!");
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no go",
      }),
    };
  }
  /* no basic role, no go */
  if (uRoles[0] !== "basic") {
    console.log("No basic role!");
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no go",
      }),
    };
  }
  /* no id, no go */
  if (!id.length < 1) {
    console.log("No ID!");
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no go",
      }),
    };
  }

  try {
    const query = `*[_type == "note" && _id == "${id}"]{title, content, image, domain, preset, status, dateFrom, dateTo, user, _updatedAt, _id}`;

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
