const Job = require("./models/Job");

const formatDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

async function seedIfEmpty() {
  try {
    const demoKey = {
      title: "UX Designer",
      company: "Designic",
      location: "Bangalore, IN",
    };
    if (await Job.exists(demoKey)) return;

    const posted = new Date("2026-02-16T12:00:00.000Z");
    const expires = new Date("2026-03-10T12:00:00.000Z");

    const description = `Join our team as a UI/UX Designer where you will collaborate with cross-functional teams to shape intuitive, user-centered products. You will work on innovative projects from discovery through delivery, partnering with product, engineering, and stakeholders to deliver polished experiences that our users love.`;

    const requirements = [
      "2+ years of professional experience in UI/UX design.",
      "Strong portfolio demonstrating product thinking and visual craft.",
      "Proficiency in Figma and Adobe Creative Suite.",
      "Solid understanding of user-centered design and accessibility.",
      "Experience contributing to design systems and brand guidelines.",
      "Ability to produce clean, modern interface designs and prototypes.",
      "Comfortable presenting work and iterating based on feedback.",
      "Strong communication and collaboration skills.",
      "Able to work independently and meet deadlines in a fast-paced environment.",
      "Bachelor’s degree in Design, HCI, or a related field.",
      "Bonus: motion graphics and advanced prototyping experience.",
    ].join("\n");

    await Job.create({
      ...demoKey,
      type: "Full time",
      salary: "$70,000 – $100,000",
      description,
      requirements,
      expiresAt: expires,
      jobLevel: "Entry Level",
      experienceLevel: "1 - 2 years",
      educationLevel: "Graduation",
      createdAt: posted,
      updatedAt: posted,
    });

    console.log(
      `Seeded demo job (UX Designer). Posted ${formatDate(posted)}, expires ${formatDate(expires)}.`
    );
  } catch (err) {
    console.error("Demo job seed skipped:", err.message);
  }
}

module.exports = { seedIfEmpty };
