export default {
  name: "domain",
  title: "Domain",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "url",
      title: "Url",
      type: "string",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Online", value: "online" },
          { title: "Offline", value: "offline" },
        ],
      },
    },
    {
      name: "belongsTo",
      title: "User",
      type: "reference",
      to: [{ type: "webUser" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "belongsTo.email",
    },
  },
};
