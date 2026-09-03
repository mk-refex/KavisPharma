import { readJson, writeJson } from "../services/dataStore.js";

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateAboutContent(body) {
  const { heroSlides, intro, prideBanner, cards, howWeDoIt, technologies, team, cta } =
    body || {};

  if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
    return "Hero slides must be a non-empty array";
  }

  for (const slide of heroSlides) {
    if (!trimString(slide.title) || !trimString(slide.description) || !trimString(slide.image)) {
      return "Each hero slide requires title, description, and image";
    }
  }

  if (!trimString(intro?.title) || !trimString(intro?.description)) {
    return "Intro section requires title and description";
  }

  if (!trimString(prideBanner?.text) || !trimString(prideBanner?.backgroundImage)) {
    return "Pride banner requires text and background image";
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    return "About cards must be a non-empty array";
  }

  for (const card of cards) {
    if (!trimString(card.title) || !trimString(card.description) || !trimString(card.image)) {
      return "Each about card requires title, description, and image";
    }
  }

  if (
    !trimString(howWeDoIt?.title) ||
    !trimString(howWeDoIt?.description) ||
    !trimString(howWeDoIt?.qualityAssurance?.title) ||
    !trimString(howWeDoIt?.qualityAssurance?.description) ||
    !trimString(howWeDoIt?.qualityAssurance?.image)
  ) {
    return "How We Do It section is incomplete";
  }

  if (
    !trimString(technologies?.title) ||
    !trimString(technologies?.description) ||
    !Array.isArray(technologies?.cards) ||
    technologies.cards.length === 0
  ) {
    return "Technologies section is incomplete";
  }

  for (const card of technologies.cards) {
    if (!trimString(card.title) || !trimString(card.backText) || !trimString(card.image)) {
      return "Each technology card requires title, back text, and image";
    }
  }

  if (
    !trimString(team?.title) ||
    !trimString(team?.description) ||
    !Array.isArray(team?.members) ||
    team.members.length === 0
  ) {
    return "Team section is incomplete";
  }

  for (const member of team.members) {
    if (
      !trimString(member.name) ||
      !trimString(member.role) ||
      !trimString(member.description) ||
      !trimString(member.image)
    ) {
      return "Each team member requires name, role, description, and image";
    }
  }

  if (!trimString(cta?.title) || !trimString(cta?.buttonText) || !trimString(cta?.buttonLink)) {
    return "CTA section is incomplete";
  }

  return null;
}

function normalizeAboutContent(body) {
  return {
    heroSlides: body.heroSlides.map((slide) => ({
      title: trimString(slide.title),
      description: trimString(slide.description),
      image: trimString(slide.image),
    })),
    intro: {
      title: trimString(body.intro.title),
      description: trimString(body.intro.description),
    },
    prideBanner: {
      text: trimString(body.prideBanner.text),
      backgroundImage: trimString(body.prideBanner.backgroundImage),
    },
    cards: body.cards.map((card) => ({
      image: trimString(card.image),
      title: trimString(card.title),
      description: trimString(card.description),
    })),
    howWeDoIt: {
      title: trimString(body.howWeDoIt.title),
      description: trimString(body.howWeDoIt.description),
      qualityAssurance: {
        title: trimString(body.howWeDoIt.qualityAssurance.title),
        description: trimString(body.howWeDoIt.qualityAssurance.description),
        image: trimString(body.howWeDoIt.qualityAssurance.image),
      },
    },
    technologies: {
      title: trimString(body.technologies.title),
      description: trimString(body.technologies.description),
      cards: body.technologies.cards.map((card) => ({
        title: trimString(card.title),
        backText: trimString(card.backText),
        image: trimString(card.image),
      })),
    },
    team: {
      title: trimString(body.team.title),
      description: trimString(body.team.description),
      members: body.team.members.map((member) => ({
        image: trimString(member.image),
        name: trimString(member.name),
        role: trimString(member.role),
        description: trimString(member.description),
      })),
    },
    cta: {
      title: trimString(body.cta.title),
      buttonText: trimString(body.cta.buttonText),
      buttonLink: trimString(body.cta.buttonLink),
      image: trimString(body.cta.image) || undefined,
    },
  };
}

export async function getAboutContent(_req, res) {
  try {
    const content = await readJson("about.json");
    if (!content) {
      return res.status(404).json({ message: "About content not found" });
    }
    return res.json(content);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get about content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAboutContent(req, res) {
  try {
    const validationError = validateAboutContent(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = normalizeAboutContent(req.body);
    await writeJson("about.json", payload);
    return res.json({
      message: "About content updated successfully",
      data: payload,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update about content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
