import { readJson, writeJson } from "../services/dataStore.js";

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactContent(body) {
  const { intro, phone, address, form, socialLinks, decorativeImage } = body || {};

  if (!trimString(intro)) return "Intro text is required";
  if (!trimString(phone)) return "Phone is required";
  if (!trimString(address)) return "Address is required";
  if (!trimString(decorativeImage)) return "Decorative image is required";

  if (
    !trimString(form?.nameLabel) ||
    !trimString(form?.emailPlaceholder) ||
    !trimString(form?.phonePlaceholder) ||
    !trimString(form?.messagePlaceholder) ||
    !trimString(form?.submitText) ||
    !trimString(form?.successMessage)
  ) {
    return "Form settings are incomplete";
  }

  if (!Array.isArray(socialLinks)) {
    return "Social links must be an array";
  }

  for (const link of socialLinks) {
    if (!trimString(link.platform) || !trimString(link.url) || !trimString(link.icon)) {
      return "Each social link requires platform, url, and icon";
    }
  }

  return null;
}

function normalizeContactContent(body) {
  return {
    intro: trimString(body.intro),
    phone: trimString(body.phone),
    phoneHref: trimString(body.phoneHref) || `tel:${trimString(body.phone).replace(/[^\d+]/g, "")}`,
    address: trimString(body.address),
    form: {
      nameLabel: trimString(body.form.nameLabel),
      namePlaceholder: trimString(body.form.namePlaceholder || body.form.nameLabel),
      emailPlaceholder: trimString(body.form.emailPlaceholder),
      phonePlaceholder: trimString(body.form.phonePlaceholder),
      messagePlaceholder: trimString(body.form.messagePlaceholder),
      submitText: trimString(body.form.submitText),
      successMessage: trimString(body.form.successMessage),
    },
    socialLinks: body.socialLinks.map((link) => ({
      platform: trimString(link.platform),
      url: trimString(link.url),
      icon: trimString(link.icon),
    })),
    decorativeImage: trimString(body.decorativeImage),
  };
}

export async function getContactContent(_req, res) {
  try {
    const content = await readJson("contact.json");
    if (!content) {
      return res.status(404).json({ message: "Contact content not found" });
    }
    return res.json(content);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get contact content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateContactContent(req, res) {
  try {
    const validationError = validateContactContent(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = normalizeContactContent(req.body);
    await writeJson("contact.json", payload);
    return res.json({
      message: "Contact content updated successfully",
      data: payload,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update contact content error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
