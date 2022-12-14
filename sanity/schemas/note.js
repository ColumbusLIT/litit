export default {
  name: "note",
  title: "Notes",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: Rule => [
        Rule.required().min(10).error('A title of min. 3 characters is required'),
        Rule.max(50).warning('Shorter titles are usually better')
      ]
    },
    {
      name: "content",
      title: "Content",
      type: "text",
      validation: Rule => Rule.required().min(10).max(500)
    },
    {
      name: "domain",
      title: "Domain",
      type: "string",
      validation: Rule => Rule.required().min(5).max(50),
      description:
        "Simple domain reference. Currently only demo and one client is available. Extend here in the future",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      description: "optional",
    },
    {
      name: "preset",
      title: "Preset",
      type: "string",
      initialValue: "default",
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Unstyled", value: "unstyled" },
        ],
      },
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: "Published", value: "published" },
          { title: "Draft", value: "draft" },
          { title: "Archived", value: "archived" },
        ],
      },
    },
    {
      name: "dateFrom",
      title: "Active from",
      type: "date",
      description: "Leave empty to always display",
      // validation: Rule => Rule.required().min('2022-03-01T15:00:00.000Z')
    },
    {
      name: "dateTo",
      title: "Active till",
      type: "date",
      // validation: Rule => Rule.required().min(Rule.valueOfField('startDate'))
    },
    {
      name: "belongsTo",
      title: "User",
      type: "reference",
      validation: Rule => Rule.required(),
      to: [{ type: "webUser" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "domain",
    },
  },
};
