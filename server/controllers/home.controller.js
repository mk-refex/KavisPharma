import { readJson, writeJson } from "../services/dataStore.js";

export const DEFAULT_SECTION_IMAGES = {
  extrovisBanner: "https://kavispharma.com/wp-content/uploads/2024/06/bg.jpeg",
  aboutSection:
    "https://kavispharma.com/wp-content/uploads/2024/06/changing-the-future-one-experiment-at-a-time-1191463139-1040x1040-c-center-1024x1024.webp",
  qualityServices:
    "https://kavispharma.com/wp-content/uploads/2024/06/quality-as-a-service.jpeg",
  ctaHistory: "https://kavispharma.com/wp-content/uploads/2024/06/banner-01.png",
  workingAtKavis:
    "https://kavispharma.com/wp-content/uploads/2024/06/banner-01.png",
  research: [
    "https://kavispharma.com/wp-content/uploads/2024/06/slider1.png",
    "https://kavispharma.com/wp-content/uploads/2024/06/slider2.png",
    "https://kavispharma.com/wp-content/uploads/2024/06/slider3.png",
  ],
  certifications: [
    {
      icon: "https://kavispharma.com/wp-content/uploads/2024/06/icon1.jpg",
      label: "Outstanding regulatory\ntrack history",
    },
    {
      icon: "https://kavispharma.com/wp-content/uploads/2024/06/icon2.jpg",
      label: "Fully Equipped\nGMP laboratory",
    },
    {
      icon: "https://kavispharma.com/wp-content/uploads/2024/06/icon3.jpg",
      label: "Certified by FDA and\nHealth Canada",
    },
  ],
};

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSectionImages(input) {
  const source = input || {};
  return {
    extrovisBanner:
      trimString(source.extrovisBanner) || DEFAULT_SECTION_IMAGES.extrovisBanner,
    aboutSection:
      trimString(source.aboutSection) || DEFAULT_SECTION_IMAGES.aboutSection,
    qualityServices:
      trimString(source.qualityServices) ||
      DEFAULT_SECTION_IMAGES.qualityServices,
    ctaHistory: trimString(source.ctaHistory) || DEFAULT_SECTION_IMAGES.ctaHistory,
    workingAtKavis:
      trimString(source.workingAtKavis) || DEFAULT_SECTION_IMAGES.workingAtKavis,
    research:
      Array.isArray(source.research) && source.research.length > 0
        ? source.research.map((url) => trimString(url)).filter(Boolean)
        : [...DEFAULT_SECTION_IMAGES.research],
    certifications:
      Array.isArray(source.certifications) && source.certifications.length > 0
        ? source.certifications.map((item) => ({
            icon: trimString(item.icon),
            label: trimString(item.label),
          }))
        : DEFAULT_SECTION_IMAGES.certifications.map((item) => ({ ...item })),
  };
}

function validateHomeContent(body) {
  const { heroSlides, stats, sectionImages } = body || {};

  if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
    return "Hero slides must be a non-empty array";
  }

  for (const slide of heroSlides) {
    if (!slide.tagline?.trim() || !slide.description?.trim() || !slide.image?.trim()) {
      return "Each hero slide requires tagline, description, and image";
    }
  }

  if (!Array.isArray(stats) || stats.length === 0) {
    return "Stats must be a non-empty array";
  }

  for (const stat of stats) {
    if (
      typeof stat.value !== "number" ||
      Number.isNaN(stat.value) ||
      !stat.label?.trim()
    ) {
      return "Each stat requires a numeric value and label";
    }
    if (typeof stat.suffix !== "string") {
      return "Each stat suffix must be a string";
    }
  }

  const images = normalizeSectionImages(sectionImages);
  if (!images.extrovisBanner || !images.aboutSection || !images.qualityServices) {
    return "Section images are incomplete";
  }
  if (!images.research.length) {
    return "At least one research image is required";
  }
  for (const cert of images.certifications) {
    if (!cert.icon || !cert.label) {
      return "Each certification requires icon and label";
    }
  }

  return null;
}

function withDefaults(content) {
  return {
    ...content,
    sectionImages: normalizeSectionImages(content?.sectionImages),
  };
}

export async function getHomeContent(_req, res) {
  try {
    const content = await readJson("home.json");
    if (!content) {
      return res.status(404).json({ message: "Home content not found" });
    }
    return res.json(withDefaults(content));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get home content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateHomeContent(req, res) {
  try {
    const validationError = validateHomeContent(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = {
      heroSlides: req.body.heroSlides.map((slide) => ({
        tagline: slide.tagline.trim(),
        description: slide.description.trim(),
        image: slide.image.trim(),
      })),
      stats: req.body.stats.map((stat) => ({
        value: Number(stat.value),
        suffix: String(stat.suffix ?? ""),
        label: stat.label.trim(),
      })),
      sectionImages: normalizeSectionImages(req.body.sectionImages),
    };

    await writeJson("home.json", payload);
    return res.json({
      message: "Home content updated successfully",
      data: payload,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update home content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
