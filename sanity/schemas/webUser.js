export default {
  name: "webUser",
  title: "Website Users",
  type: "document",
  fields: [
    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "fullName",
      title: "Full Name",
      type: "string",
    },
    {
      name: "domain",
      title: "Domain",
      type: "string",
      description:
        "Be aware that changing the domain will make all previews notes unaccesable for that user",
    },
  ],
};
