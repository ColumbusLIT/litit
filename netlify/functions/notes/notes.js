const process = require("process");

const client = require("../client");

const handler = async (event, context) => {
  if (!context.clientContext.user)
    return {
      headers: { "Content-Type": "application/json", "x-litit-error-code":"AccessDenied" },
      statusCode: 403,
      body:
        error.responseBody || JSON.stringify({ error: "Access denied" }),
    };

  const uId = context.clientContext.user.sub;
  const uRoles = context.clientContext.user.app_metadata.roles;

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

  try {
    const query = `*[_type == "note" && references("${uId}")]{title, content, image, domain, preset, status, dateFrom, dateTo, user, _updatedAt, _id}`;

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notes),
    };
  } catch (error) {
    return {
      headers: { "Content-Type": "application/json" },
      statusCode: 500,
      body:
        error.responseBody || JSON.stringify({ error: "An error occurred" }),
    };
  }
};

module.exports = { handler };
