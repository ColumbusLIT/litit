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

  const uId = context.clientContext.user.sub;
  const uRoles = context.clientContext.user.app_metadata.roles;

  /* no user, no go */
  if (!uId) {
    console.log("No user!");
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no user",
      }),
    };
  }

  /* no basic role, no go */
  if (uRoles[0] !== "basic") {
    console.log("No basic role!");
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no role assigned",
      }),
    };
  }

  
  const newNote = {
    updateThisId: event.queryStringParameters.id,
    content: event.queryStringParameters.content,
    // TODO: image
    domain: event.queryStringParameters.domain,
    preset: event.queryStringParameters.preset,
    status: event.queryStringParameters.status,
  };
  context.log("here",newNote)

  /* TODO: Plan release date */
  if (event.queryStringParameters.planRelease) {
    newNote.dateFrom = event.queryStringParameters.dateFrom;
    newNote.dateTo = event.queryStringParameters.dateTo;
  } 

  try {
    const result = await client
      .patch(updateThisId)
      .set(newNote)
      .commit()
      .then((res) => {
        console.log("RESULT FROM SANITY: ", res);
      });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log(error);
    return {
      headers: { "Content-Type": "application/json" },
      statusCode: 500,
      body:
        error.responseBody || JSON.stringify({ error: "An error occurred" }),
    };
  }
};

module.exports = { handler };
