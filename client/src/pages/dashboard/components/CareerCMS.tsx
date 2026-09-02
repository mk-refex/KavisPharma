import { useEffect, useState, type ReactNode } from "react";
import {
  getCareerContent,
  saveCareerContent,
  type CareerContent,
  type JobOpening,
} from "@/services/api";
import { defaultCareerContent } from "@/data/careerDefaults";
import CareerJobsEditor from "./CareerJobsEditor";
import ImageField from "@/components/cms/ImageField";

interface CareerCMSProps {
  showNotification: (message: string, type?: "success" | "error") => void;
}

type CareerTab =
  | "hero"
  | "growth"
  | "contact"
  | "jobs"
  | "diversity"
  | "bottom";

const tabs: { id: CareerTab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "growth", label: "Career Growth" },
  { id: "contact", label: "Contact CTA" },
  { id: "jobs", label: "Job Openings" },
  { id: "diversity", label: "Diversity" },
  { id: "bottom", label: "Bottom Image" },
];

const inputClass =
  "w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground-700 mb-1">
        {label}
      </label>
      {hint && (
        <p className="text-xs text-foreground-500 mb-1.5">{hint}</p>
      )}
      {children}
    </div>
  );
}

export default function CareerCMS({ showNotification }: CareerCMSProps) {
  const [activeTab, setActiveTab] = useState<CareerTab>("jobs");
  const [content, setContent] = useState<CareerContent>(defaultCareerContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCareerContent()
      .then((data) => setContent(data))
      .catch(() => showNotification("Failed to load career content", "error"))
      .finally(() => setLoading(false));
  }, [showNotification]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await saveCareerContent(content);
      setContent(response.data);
      showNotification("Career page content saved successfully");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to save content",
        "error",
      );
    } finally {
      setSaving(false);
    }
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
            Career Page Content
          </h2>
          <p className="text-sm text-foreground-600 mt-1">
            Manage career messaging and post professional job openings.
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
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <Field label="Headline">
            <input
              className={inputClass}
              value={content.hero.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputClass} resize-y`}
              rows={3}
              value={content.hero.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, description: e.target.value },
                }))
              }
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Button Text">
              <input
                className={inputClass}
                value={content.hero.buttonText}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, buttonText: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Button Link">
              <input
                className={inputClass}
                value={content.hero.buttonLink}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, buttonLink: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
          <ImageField
            label="Hero Background Image"
            value={content.hero.backgroundImage}
            onChange={(url) =>
              setContent((prev) => ({
                ...prev,
                hero: { ...prev.hero, backgroundImage: url },
              }))
            }
            hint="Upload a file or paste an image URL"
          />
        </div>
      )}

      {activeTab === "growth" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
            <Field label="Section Title">
              <input
                className={inputClass}
                value={content.growth.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    growth: { ...prev.growth, title: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Section Description">
              <textarea
                className={`${inputClass} resize-y`}
                rows={3}
                value={content.growth.description}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    growth: { ...prev.growth, description: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
          {content.growth.cards.map((card, index) => (
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
                  disabled={content.growth.cards.length <= 1}
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      growth: {
                        ...prev.growth,
                        cards: prev.growth.cards.filter((_, i) => i !== index),
                      },
                    }))
                  }
                  className="text-sm text-red-600 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <Field label="Icon class" hint="Remix Icon class, e.g. ri-team-line">
                <input
                  className={inputClass}
                  value={card.icon}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      growth: {
                        ...prev.growth,
                        cards: prev.growth.cards.map((c, i) =>
                          i === index ? { ...c, icon: e.target.value } : c,
                        ),
                      },
                    }))
                  }
                />
              </Field>
              <Field label="Text">
                <textarea
                  className={`${inputClass} resize-y`}
                  rows={3}
                  value={card.text}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      growth: {
                        ...prev.growth,
                        cards: prev.growth.cards.map((c, i) =>
                          i === index ? { ...c, text: e.target.value } : c,
                        ),
                      },
                    }))
                  }
                />
              </Field>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                growth: {
                  ...prev.growth,
                  cards: [...prev.growth.cards, { icon: "ri-star-line", text: "" }],
                },
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-add-line"></i>
            Add Card
          </button>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <Field label="Title">
            <input
              className={inputClass}
              value={content.contactCta.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contactCta: { ...prev.contactCta, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={inputClass}
              value={content.contactCta.subtitle}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contactCta: { ...prev.contactCta, subtitle: e.target.value },
                }))
              }
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Button Text">
              <input
                className={inputClass}
                value={content.contactCta.buttonText}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    contactCta: {
                      ...prev.contactCta,
                      buttonText: e.target.value,
                    },
                  }))
                }
              />
            </Field>
            <Field label="Button Link">
              <input
                className={inputClass}
                value={content.contactCta.buttonLink}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    contactCta: {
                      ...prev.contactCta,
                      buttonLink: e.target.value,
                    },
                  }))
                }
              />
            </Field>
          </div>
        </div>
      )}

      {activeTab === "jobs" && (
        <CareerJobsEditor
          jobs={content.jobBoard.jobs}
          sectionTitle={content.jobBoard.title}
          sectionDescription={content.jobBoard.description}
          emptyMessage={content.jobBoard.emptyMessage}
          onSectionChange={(field, value) =>
            setContent((prev) => ({
              ...prev,
              jobBoard: { ...prev.jobBoard, [field]: value },
            }))
          }
          onJobsChange={(jobs: JobOpening[]) =>
            setContent((prev) => ({
              ...prev,
              jobBoard: { ...prev.jobBoard, jobs },
            }))
          }
        />
      )}

      {activeTab === "diversity" && (
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <Field label="Title">
            <input
              className={inputClass}
              value={content.diversity.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  diversity: { ...prev.diversity, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputClass} resize-y`}
              rows={4}
              value={content.diversity.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  diversity: {
                    ...prev.diversity,
                    description: e.target.value,
                  },
                }))
              }
            />
          </Field>
        </div>
      )}

      {activeTab === "bottom" && (
        <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
          <ImageField
            label="Bottom Image"
            value={content.bottomImage.imageUrl}
            onChange={(url) =>
              setContent((prev) => ({
                ...prev,
                bottomImage: { imageUrl: url },
              }))
            }
            hint="Upload a file or paste an image URL"
          />
        </div>
      )}
    </div>
  );
}
