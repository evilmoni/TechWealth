const { sanityClient } = require("../lib/sanityClient");

const EVENTS_QUERY = /* groq */ `
  *[_type == "event"] | order(eventDate asc) {
    _id,
    title,
    eventDate,
    attendees,
    category,
    countdownTarget,
    "thumbnailUrl": thumbnail.asset->url
  }
`;

module.exports = async function handler(req, res) {
  try {
    // "ISR-like" caching on Vercel's edge/CDN:
    // serve cached response for 60s, then revalidate in background.
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=600");

    const events = await sanityClient.fetch(EVENTS_QUERY);
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch events",
      message: err?.message || String(err),
    });
  }
};

