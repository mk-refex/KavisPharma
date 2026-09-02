import { useEffect, useState } from "react";
import {
  getContactContent,
  saveContactContent,
  type ContactContent,
} from "@/services/api";
import ImageField from "@/components/cms/ImageField";
import { defaultContactContent } from "@/data/contactDefaults";

interface ContactCMSProps {
  showNotification: (message: string, type?: "success" | "error") => void;
}

const inputClass =
  "w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none";

export default function ContactCMS({ showNotification }: ContactCMSProps) {
  const [content, setContent] = useState<ContactContent>(defaultContactContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getContactContent()
      .then((data) => setContent(data))
      .catch(() => showNotification("Failed to load contact content", "error"))
      .finally(() => setLoading(false));
  }, [showNotification]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await saveContactContent(content);
      setContent(response.data);
      showNotification("Contact page content saved successfully");
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
            Contact Page Content
          </h2>
          <p className="text-sm text-foreground-600 mt-1">
            Manage intro text, contact details, form labels, and social links.
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

      <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
        <h3 className="font-semibold text-secondary-900">Intro & contact info</h3>
        <div>
          <label className="block text-sm font-medium text-foreground-700 mb-1">
            Intro Text
          </label>
          <textarea
            rows={3}
            className={`${inputClass} resize-y`}
            value={content.intro}
            onChange={(e) =>
              setContent((prev) => ({ ...prev, intro: e.target.value }))
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-700 mb-1">
              Phone
            </label>
            <input
              className={inputClass}
              value={content.phone}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-700 mb-1">
              Phone Link
            </label>
            <input
              className={inputClass}
              value={content.phoneHref}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, phoneHref: e.target.value }))
              }
              placeholder="tel:+12812401000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-700 mb-1">
            Address
          </label>
          <input
            className={inputClass}
            value={content.address}
            onChange={(e) =>
              setContent((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>
        <ImageField
          label="Decorative Image"
          value={content.decorativeImage}
          onChange={(url) =>
            setContent((prev) => ({ ...prev, decorativeImage: url }))
          }
          hint="Upload a file or paste an image URL"
        />
      </div>

      <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
        <h3 className="font-semibold text-secondary-900">Form labels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              ["nameLabel", "Name Label"],
              ["namePlaceholder", "Name Placeholder"],
              ["emailPlaceholder", "Email Placeholder"],
              ["phonePlaceholder", "Phone Placeholder"],
              ["messagePlaceholder", "Message Placeholder"],
              ["submitText", "Submit Button Text"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-foreground-700 mb-1">
                {label}
              </label>
              <input
                className={inputClass}
                value={content.form[key]}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    form: { ...prev.form, [key]: e.target.value },
                  }))
                }
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-700 mb-1">
            Success Message
          </label>
          <input
            className={inputClass}
            value={content.form.successMessage}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                form: { ...prev.form, successMessage: e.target.value },
              }))
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-background-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-secondary-900">Social links</h3>
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                socialLinks: [
                  ...prev.socialLinks,
                  { platform: "", url: "", icon: "ri-links-line" },
                ],
              }))
            }
            className="text-sm font-medium text-primary-600"
          >
            + Add link
          </button>
        </div>
        {content.socialLinks.map((link, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-background-200 rounded-lg p-4"
          >
            <input
              className={inputClass}
              placeholder="Platform"
              value={link.platform}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  socialLinks: prev.socialLinks.map((item, i) =>
                    i === index ? { ...item, platform: e.target.value } : item,
                  ),
                }))
              }
            />
            <input
              className={inputClass}
              placeholder="URL"
              value={link.url}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  socialLinks: prev.socialLinks.map((item, i) =>
                    i === index ? { ...item, url: e.target.value } : item,
                  ),
                }))
              }
            />
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Icon class (ri-facebook-fill)"
                value={link.icon}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    socialLinks: prev.socialLinks.map((item, i) =>
                      i === index ? { ...item, icon: e.target.value } : item,
                    ),
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    socialLinks: prev.socialLinks.filter((_, i) => i !== index),
                  }))
                }
                className="px-3 text-red-600"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
