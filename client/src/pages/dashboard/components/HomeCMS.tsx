import { useEffect, useState } from "react";
import {
  getHomeContent,
  saveHomeContent,
  type HeroSlide,
  type HomeContent,
  type HomeStat,
} from "@/services/api";
import ImageField from "@/components/cms/ImageField";

interface HomeCMSProps {
  showNotification: (message: string, type?: "success" | "error") => void;
}

const defaultSectionImages: HomeContent["sectionImages"] = {
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

const emptySlide = (): HeroSlide => ({
  tagline: "",
  description: "",
  image: "",
});

const emptyStat = (): HomeStat => ({
  value: 0,
  suffix: "",
  label: "",
});

type HomeTab = "hero" | "stats" | "images";

export default function HomeCMS({ showNotification }: HomeCMSProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>("hero");
  const [content, setContent] = useState<HomeContent>({
    heroSlides: [],
    stats: [],
    sectionImages: defaultSectionImages,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHomeContent()
      .then((data) =>
        setContent({
          ...data,
          sectionImages: data.sectionImages || defaultSectionImages,
        }),
      )
      .catch(() => showNotification("Failed to load home content", "error"))
      .finally(() => setLoading(false));
  }, [showNotification]);

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    setContent((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide,
      ),
    }));
  };

  const updateStat = (
    index: number,
    field: keyof HomeStat,
    value: string | number,
  ) => {
    setContent((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat,
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await saveHomeContent(content);
      setContent(response.data);
      showNotification("Home page content saved successfully");
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

  const tabs: { id: HomeTab; label: string }[] = [
    { id: "hero", label: "Hero Slider" },
    { id: "stats", label: "Statistics" },
    { id: "images", label: "Section Images" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-secondary-900">
            Home Page Content
          </h2>
          <p className="text-sm text-foreground-600 mt-1">
            Manage hero slides, stats, and section images.
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

      <div className="border-b border-background-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
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
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      heroSlides: prev.heroSlides.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-sm text-red-600 hover:text-red-700"
                  disabled={content.heroSlides.length <= 1}
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={slide.tagline}
                  onChange={(e) =>
                    updateSlide(index, "tagline", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  Description
                </label>
                <textarea
                  value={slide.description}
                  onChange={(e) =>
                    updateSlide(index, "description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-y"
                />
              </div>

              <ImageField
                label="Hero Image"
                value={slide.image}
                onChange={(url) => updateSlide(index, "image", url)}
                hint="Upload a file or paste an image URL"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                heroSlides: [...prev.heroSlides, emptySlide()],
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-add-line"></i>
            Add Slide
          </button>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-4">
          {content.stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-background-200 p-5 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) =>
                    updateStat(index, "value", Number(e.target.value))
                  }
                  className="w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  Suffix
                </label>
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) => updateStat(index, "suffix", e.target.value)}
                  placeholder="+, %, etc."
                  className="w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  className="w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      stats: prev.stats.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-sm text-red-600 hover:text-red-700"
                  disabled={content.stats.length <= 1}
                >
                  Remove stat
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                stats: [...prev.stats, emptyStat()],
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-add-line"></i>
            Add Stat
          </button>
        </div>
      )}

      {activeTab === "images" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
            <ImageField
              label="Extrovis Banner Background"
              value={content.sectionImages.extrovisBanner}
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  sectionImages: { ...prev.sectionImages, extrovisBanner: url },
                }))
              }
            />
            <ImageField
              label="About Section Image"
              value={content.sectionImages.aboutSection}
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  sectionImages: { ...prev.sectionImages, aboutSection: url },
                }))
              }
            />
            <ImageField
              label="Quality Services Image"
              value={content.sectionImages.qualityServices}
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  sectionImages: {
                    ...prev.sectionImages,
                    qualityServices: url,
                  },
                }))
              }
            />
            <ImageField
              label="CTA History Background"
              value={content.sectionImages.ctaHistory}
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  sectionImages: { ...prev.sectionImages, ctaHistory: url },
                }))
              }
            />
            <ImageField
              label="Working at Kavis Background"
              value={content.sectionImages.workingAtKavis}
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  sectionImages: { ...prev.sectionImages, workingAtKavis: url },
                }))
              }
            />
          </div>

          <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
            <h3 className="font-semibold text-secondary-900">Research Images</h3>
            {content.sectionImages.research.map((url, index) => (
              <div key={index} className="space-y-2">
                <ImageField
                  label={`Research Image ${index + 1}`}
                  value={url}
                  onChange={(nextUrl) =>
                    setContent((prev) => ({
                      ...prev,
                      sectionImages: {
                        ...prev.sectionImages,
                        research: prev.sectionImages.research.map((item, i) =>
                          i === index ? nextUrl : item,
                        ),
                      },
                    }))
                  }
                />
                <button
                  type="button"
                  disabled={content.sectionImages.research.length <= 1}
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      sectionImages: {
                        ...prev.sectionImages,
                        research: prev.sectionImages.research.filter(
                          (_, i) => i !== index,
                        ),
                      },
                    }))
                  }
                  className="text-sm text-red-600 disabled:opacity-40"
                >
                  Remove image
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  sectionImages: {
                    ...prev.sectionImages,
                    research: [...prev.sectionImages.research, ""],
                  },
                }))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
            >
              <i className="ri-add-line"></i>
              Add Research Image
            </button>
          </div>

          <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
            <h3 className="font-semibold text-secondary-900">Certifications</h3>
            {content.sectionImages.certifications.map((cert, index) => (
              <div
                key={index}
                className="border border-background-200 rounded-lg p-4 space-y-3"
              >
                <ImageField
                  label={`Certification Icon ${index + 1}`}
                  value={cert.icon}
                  onChange={(url) =>
                    setContent((prev) => ({
                      ...prev,
                      sectionImages: {
                        ...prev.sectionImages,
                        certifications: prev.sectionImages.certifications.map(
                          (item, i) =>
                            i === index ? { ...item, icon: url } : item,
                        ),
                      },
                    }))
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1">
                    Label
                  </label>
                  <textarea
                    rows={2}
                    value={cert.label}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        sectionImages: {
                          ...prev.sectionImages,
                          certifications: prev.sectionImages.certifications.map(
                            (item, i) =>
                              i === index
                                ? { ...item, label: e.target.value }
                                : item,
                          ),
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-y"
                  />
                </div>
                <button
                  type="button"
                  disabled={content.sectionImages.certifications.length <= 1}
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      sectionImages: {
                        ...prev.sectionImages,
                        certifications:
                          prev.sectionImages.certifications.filter(
                            (_, i) => i !== index,
                          ),
                      },
                    }))
                  }
                  className="text-sm text-red-600 disabled:opacity-40"
                >
                  Remove certification
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  sectionImages: {
                    ...prev.sectionImages,
                    certifications: [
                      ...prev.sectionImages.certifications,
                      { icon: "", label: "" },
                    ],
                  },
                }))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
            >
              <i className="ri-add-line"></i>
              Add Certification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
