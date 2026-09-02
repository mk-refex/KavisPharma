import { readJson, writeJson } from "../services/dataStore.js";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
];
const WORK_MODES = ["On-site", "Hybrid", "Remote"];
const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead", "Executive"];
const JOB_STATUSES = ["Open", "Closed", "Draft"];

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateJob(job, index) {
  const label = `Job ${index + 1}`;

  if (!trimString(job.title)) {
    return `${label}: Job title is required`;
  }
  if (!trimString(job.department)) {
    return `${label}: Department is required`;
  }
  if (!EMPLOYMENT_TYPES.includes(job.employmentType)) {
    return `${label}: Invalid employment type`;
  }
  if (!WORK_MODES.includes(job.workMode)) {
    return `${label}: Invalid work mode`;
  }
  if (!trimString(job.location)) {
    return `${label}: Location is required`;
  }
  if (!EXPERIENCE_LEVELS.includes(job.experienceLevel)) {
    return `${label}: Invalid experience level`;
  }
  if (!trimString(job.summary)) {
    return `${label}: Short summary is required`;
  }
  if (!trimString(job.responsibilities)) {
    return `${label}: Responsibilities are required`;
  }
  if (!trimString(job.requirements)) {
    return `${label}: Requirements are required`;
  }
  if (!JOB_STATUSES.includes(job.status)) {
    return `${label}: Invalid status`;
  }
  if (!trimString(job.applyEmail) && !trimString(job.applyUrl)) {
    return `${label}: Provide an apply email or apply URL`;
  }
  if (
    typeof job.openings !== "number" ||
    Number.isNaN(job.openings) ||
    job.openings < 1
  ) {
    return `${label}: Openings must be at least 1`;
  }

  return null;
}

function validateCareerContent(body) {
  const { hero, growth, contactCta, jobBoard, diversity, bottomImage } =
    body || {};

  if (
    !trimString(hero?.title) ||
    !trimString(hero?.description) ||
    !trimString(hero?.buttonText) ||
    !trimString(hero?.buttonLink) ||
    !trimString(hero?.backgroundImage)
  ) {
    return "Hero section is incomplete";
  }

  if (
    !trimString(growth?.title) ||
    !trimString(growth?.description) ||
    !Array.isArray(growth?.cards) ||
    growth.cards.length === 0
  ) {
    return "Growth section is incomplete";
  }

  for (const card of growth.cards) {
    if (!trimString(card.icon) || !trimString(card.text)) {
      return "Each growth card requires icon and text";
    }
  }

  if (
    !trimString(contactCta?.title) ||
    !trimString(contactCta?.subtitle) ||
    !trimString(contactCta?.buttonText) ||
    !trimString(contactCta?.buttonLink)
  ) {
    return "Contact CTA section is incomplete";
  }

  if (
    !trimString(jobBoard?.title) ||
    !trimString(jobBoard?.description) ||
    !trimString(jobBoard?.emptyMessage) ||
    !Array.isArray(jobBoard?.jobs)
  ) {
    return "Job board section is incomplete";
  }

  for (let i = 0; i < jobBoard.jobs.length; i += 1) {
    const error = validateJob(jobBoard.jobs[i], i);
    if (error) return error;
  }

  if (!trimString(diversity?.title) || !trimString(diversity?.description)) {
    return "Diversity section is incomplete";
  }

  if (!trimString(bottomImage?.imageUrl)) {
    return "Bottom image URL is required";
  }

  return null;
}

function normalizeJob(job, index) {
  return {
    id: trimString(job.id) || `job-${Date.now()}-${index}`,
    jobCode: trimString(job.jobCode),
    title: trimString(job.title),
    department: trimString(job.department),
    employmentType: job.employmentType,
    workMode: job.workMode,
    location: trimString(job.location),
    experienceLevel: job.experienceLevel,
    experienceYears: trimString(job.experienceYears),
    education: trimString(job.education),
    summary: trimString(job.summary),
    responsibilities: trimString(job.responsibilities),
    requirements: trimString(job.requirements),
    preferredQualifications: trimString(job.preferredQualifications),
    benefits: trimString(job.benefits),
    salaryRange: trimString(job.salaryRange),
    openings: Number(job.openings) || 1,
    applyEmail: trimString(job.applyEmail),
    applyUrl: trimString(job.applyUrl),
    postedDate: trimString(job.postedDate),
    closingDate: trimString(job.closingDate),
    status: job.status,
    isFeatured: Boolean(job.isFeatured),
  };
}

function normalizeCareerContent(body) {
  return {
    hero: {
      title: trimString(body.hero.title),
      description: trimString(body.hero.description),
      buttonText: trimString(body.hero.buttonText),
      buttonLink: trimString(body.hero.buttonLink),
      backgroundImage: trimString(body.hero.backgroundImage),
    },
    growth: {
      title: trimString(body.growth.title),
      description: trimString(body.growth.description),
      cards: body.growth.cards.map((card) => ({
        icon: trimString(card.icon),
        text: trimString(card.text),
      })),
    },
    contactCta: {
      title: trimString(body.contactCta.title),
      subtitle: trimString(body.contactCta.subtitle),
      buttonText: trimString(body.contactCta.buttonText),
      buttonLink: trimString(body.contactCta.buttonLink),
    },
    jobBoard: {
      title: trimString(body.jobBoard.title),
      description: trimString(body.jobBoard.description),
      emptyMessage: trimString(body.jobBoard.emptyMessage),
      jobs: body.jobBoard.jobs.map(normalizeJob),
    },
    diversity: {
      title: trimString(body.diversity.title),
      description: trimString(body.diversity.description),
    },
    bottomImage: {
      imageUrl: trimString(body.bottomImage.imageUrl),
    },
  };
}

export async function getCareerContent(_req, res) {
  try {
    const content = await readJson("career.json");
    if (!content) {
      return res.status(404).json({ message: "Career content not found" });
    }
    return res.json(content);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get career content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCareerContent(req, res) {
  try {
    const validationError = validateCareerContent(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = normalizeCareerContent(req.body);
    await writeJson("career.json", payload);
    return res.json({
      message: "Career content updated successfully",
      data: payload,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update career content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
