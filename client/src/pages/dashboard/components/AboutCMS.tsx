import { useEffect, useState, type ReactNode } from "react";
import {
  getAboutContent,
  saveAboutContent,
  type AboutContent,
  type AboutHeroSlide,
  type AboutCard,
  type TechCard,
  type TeamMember,
} from "@/services/api";
import { defaultAboutContent } from "@/data/aboutDefaults";
import ImageField from "@/components/cms/ImageField";

interface AboutCMSProps {
  showNotification: (message: string, type?: "success" | "error") => void;
}

type AboutTab =
  | "hero"
  | "intro"
  | "pride"
  | "cards"
  | "how"
  | "tech"
  | "team"
  | "cta";

const tabs: { id: AboutTab; label: string }[] = [
  { id: "hero", label: "Hero Slider" },
  { id: "intro", label: "Intro" },
  { id: "pride", label: "Pride Banner" },
  { id: "cards", label: "About Cards" },
  { id: "how", label: "How We Do It" },
  { id: "tech", label: "Technologies" },
  { id: "team", label: "Team" },
  { id: "cta", label: "CTA" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none";

export default function AboutCMS({ showNotification }: AboutCMSProps) {
  const [activeTab, setActiveTab] = useState<AboutTab>("hero");
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAboutContent()
      .then((data) => setContent(data))
      .catch(() => showNotification("Failed to load about content", "error"))
      .finally(() => setLoading(false));
  }, [showNotification]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await saveAboutContent(content);
      setContent(response.data);
      showNotification("About page content saved successfully");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to save content",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSlide = (
    index: number,
    field: keyof AboutHeroSlide,
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide,
      ),
    }));
  };

  const updateCard = (index: number, field: keyof AboutCard, value: string) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.map((card, i) =>
        i === index ? { ...card, [field]: value } : card,
      ),
    }));
  };

  const updateTechCard = (
    index: number,
    field: keyof TechCard,
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      technologies: {
        ...prev.technologies,
        cards: prev.technologies.cards.map((card, i) =>
          i === index ? { ...card, [field]: value } : card,
        ),
      },
    }));
  };

  const updateMember = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      team: {
        ...prev.team,
        members: prev.team.members.map((member, i) =>
          i === index ? { ...member, [field]: value } : member,
        ),
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <i className="ri-loader-4-line animate-spin text-3xl text-primary-500"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-secondary-900">
            About Page Content
          </h2>
          <p className="text-sm text-foreground-600 mt-1">
            Manage all sections on the About page.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {saving ? (
            <>
              <i className="ri-loader-4-line animate-spin"></i>
              Saving...
            </>
          ) : (
            <>
              <i className="ri-save-line"></i>
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="border-b border-background-200 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-foreground-600 hover:text-foreground-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "hero" && (
        <div className="space-y-4">
          {content.heroSlides.map((slide, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-background-200 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-secondary-900">
                  Slide {index + 1}
                </h3>
                <button
                  type="button"
                  disabled={content.heroSlides.length <= 1}
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      heroSlides: prev.heroSlides.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={slide.title}
                  onChange={(e) => updateHeroSlide(index, "title", e.target.value)}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={`${inputClass} resize-y`}
                  rows={4}
                  value={slide.description}
                  onChange={(e) =>
                    updateHeroSlide(index, "description", e.target.value)
                  }
                />
              </Field>
              <ImageField
                label="Slide Image"
                value={slide.image}
                onChange={(url) => updateHeroSlide(index, "image", url)}
                hint="Upload a file or paste an image URL"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                heroSlides: [
                  ...prev.heroSlides,
                  { title: "", description: "", image: "" },
                ],
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-add-line"></i>
            Add Slide
          </button>
        </div>
      )}

      {activeTab === "intro" && (
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <Field label="Section Title">
            <input
              className={inputClass}
              value={content.intro.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputClass} resize-y`}
              rows={6}
              value={content.intro.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, description: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      )}

      {activeTab === "pride" && (
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <Field label="Banner Text">
            <textarea
              className={`${inputClass} resize-y`}
              rows={3}
              value={content.prideBanner.text}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  prideBanner: { ...prev.prideBanner, text: e.target.value },
                }))
              }
            />
          </Field>
          <ImageField
            label="Pride Banner Background"
            value={content.prideBanner.backgroundImage}
            onChange={(url) =>
              setContent((prev) => ({
                ...prev,
                prideBanner: {
                  ...prev.prideBanner,
                  backgroundImage: url,
                },
              }))
            }
            hint="Upload a file or paste an image URL"
          />
        </div>
      )}

      {activeTab === "cards" && (
        <div className="space-y-4">
          {content.cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-background-200 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-secondary-900">
                  Card {index + 1}
                </h3>
                <button
                  type="button"
                  disabled={content.cards.length <= 1}
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      cards: prev.cards.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={card.title}
                  onChange={(e) => updateCard(index, "title", e.target.value)}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={`${inputClass} resize-y`}
                  rows={4}
                  value={card.description}
                  onChange={(e) =>
                    updateCard(index, "description", e.target.value)
                  }
                />
              </Field>
              <ImageField
                label="Card Image"
                value={card.image}
                onChange={(url) => updateCard(index, "image", url)}
                hint="Upload a file or paste an image URL"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                cards: [...prev.cards, { title: "", description: "", image: "" }],
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-add-line"></i>
            Add Card
          </button>
        </div>
      )}

      {activeTab === "how" && (
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <Field label="Section Title">
            <input
              className={inputClass}
              value={content.howWeDoIt.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  howWeDoIt: { ...prev.howWeDoIt, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Section Description">
            <textarea
              className={`${inputClass} resize-y`}
              rows={4}
              value={content.howWeDoIt.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  howWeDoIt: { ...prev.howWeDoIt, description: e.target.value },
                }))
              }
            />
          </Field>
          <div className="pt-4 border-t border-background-200 space-y-4">
            <h3 className="font-semibold text-secondary-900">Quality Assurance</h3>
            <Field label="Title">
              <input
                className={inputClass}
                value={content.howWeDoIt.qualityAssurance.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    howWeDoIt: {
                      ...prev.howWeDoIt,
                      qualityAssurance: {
                        ...prev.howWeDoIt.qualityAssurance,
                        title: e.target.value,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputClass} resize-y`}
                rows={5}
                value={content.howWeDoIt.qualityAssurance.description}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    howWeDoIt: {
                      ...prev.howWeDoIt,
                      qualityAssurance: {
                        ...prev.howWeDoIt.qualityAssurance,
                        description: e.target.value,
                      },
                    },
                  }))
                }
              />
            </Field>
            <ImageField
              label="Quality Assurance Image"
              value={content.howWeDoIt.qualityAssurance.image}
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  howWeDoIt: {
                    ...prev.howWeDoIt,
                    qualityAssurance: {
                      ...prev.howWeDoIt.qualityAssurance,
                      image: url,
                    },
                  },
                }))
              }
              hint="Upload a file or paste an image URL"
            />
          </div>
        </div>
      )}

      {activeTab === "tech" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
            <Field label="Section Title">
              <input
                className={inputClass}
                value={content.technologies.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    technologies: { ...prev.technologies, title: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Section Description">
              <textarea
                className={`${inputClass} resize-y`}
                rows={4}
                value={content.technologies.description}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    technologies: {
                      ...prev.technologies,
                      description: e.target.value,
                    },
                  }))
                }
              />
            </Field>
          </div>
          {content.technologies.cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-background-200 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-secondary-900">
                  Card {index + 1}
                </h3>
                <button
                  type="button"
                  disabled={content.technologies.cards.length <= 1}
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      technologies: {
                        ...prev.technologies,
                        cards: prev.technologies.cards.filter(
                          (_, i) => i !== index,
                        ),
                      },
                    }))
                  }
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={card.title}
                  onChange={(e) => updateTechCard(index, "title", e.target.value)}
                />
              </Field>
              <Field label="Back Text">
                <textarea
                  className={`${inputClass} resize-y`}
                  rows={5}
                  value={card.backText}
                  onChange={(e) =>
                    updateTechCard(index, "backText", e.target.value)
                  }
                />
              </Field>
              <ImageField
                label="Technology Image"
                value={card.image}
                onChange={(url) => updateTechCard(index, "image", url)}
                hint="Upload a file or paste an image URL"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                technologies: {
                  ...prev.technologies,
                  cards: [
                    ...prev.technologies.cards,
                    { title: "", backText: "", image: "" },
                  ],
                },
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-add-line"></i>
            Add Technology Card
          </button>
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
            <Field label="Section Title">
              <input
                className={inputClass}
                value={content.team.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    team: { ...prev.team, title: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Section Description">
              <textarea
                className={`${inputClass} resize-y`}
                rows={3}
                value={content.team.description}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    team: { ...prev.team, description: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
          {content.team.members.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-background-200 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-secondary-900">
                  Member {index + 1}
                </h3>
                <button
                  type="button"
                  disabled={content.team.members.length <= 1}
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      team: {
                        ...prev.team,
                        members: prev.team.members.filter((_, i) => i !== index),
                      },
                    }))
                  }
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <Field label="Name">
                <input
                  className={inputClass}
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                />
              </Field>
              <Field label="Role">
                <input
                  className={inputClass}
                  value={member.role}
                  onChange={(e) => updateMember(index, "role", e.target.value)}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={`${inputClass} resize-y`}
                  rows={5}
                  value={member.description}
                  onChange={(e) =>
                    updateMember(index, "description", e.target.value)
                  }
                />
              </Field>
              <ImageField
                label="Member Photo"
                value={member.image}
                onChange={(url) => updateMember(index, "image", url)}
                hint="Upload a file or paste an image URL"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                team: {
                  ...prev.team,
                  members: [
                    ...prev.team.members,
                    { name: "", role: "", description: "", image: "" },
                  ],
                },
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-add-line"></i>
            Add Team Member
          </button>
        </div>
      )}

      {activeTab === "cta" && (
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <Field label="Heading">
            <input
              className={inputClass}
              value={content.cta.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Button Text">
            <input
              className={inputClass}
              value={content.cta.buttonText}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, buttonText: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Button Link">
            <input
              className={inputClass}
              value={content.cta.buttonLink}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, buttonLink: e.target.value },
                }))
              }
            />
          </Field>
          <ImageField
            label="Background Image"
            value={content.cta.image || ""}
            onChange={(url) =>
              setContent((prev) => ({
                ...prev,
                cta: { ...prev.cta, image: url },
              }))
            }
          />
        </div>
      )}
    </div>
  );
}
