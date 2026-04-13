export default {
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "eventDate", title: "Event Date", type: "datetime", validation: (Rule) => Rule.required() },
    { name: "attendees", title: "Attendance", type: "number", validation: (Rule) => Rule.required().min(0) },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["Standard", "VIP"] },
      validation: (Rule) => Rule.required(),
    },
    { name: "thumbnail", title: "Thumbnail", type: "image", options: { hotspot: true } },
    {
      name: "countdownTarget",
      title: "Countdown Target",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
  ],
};

