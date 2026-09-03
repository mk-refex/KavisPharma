import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import { getContactContent, resolveImageUrl } from '@/services/api';
import { defaultContactContent } from '@/data/contactDefaults';

export default function Contact() {
  const [content, setContent] = useState(defaultContactContent);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getContactContent()
      .then((data) => setContent(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    const form = e.currentTarget;

    const honeypot = form.querySelector<HTMLInputElement>('input[name="website_alt"]');
    if (honeypot && honeypot.value.trim() !== '') {
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (key !== 'website_alt') {
        params.append(key, value as string);
      }
    });

    try {
      const response = await fetch('https://readdy.ai/api/form/d9bgs0ahsavvukudoohg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const responseText = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = null;
      }

      const serverMsg = parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || responseText;
      const isSpam = typeof serverMsg === 'string' && (serverMsg.includes('spam') || serverMsg.includes('form data is spam'));
      const isSuccess = response.ok && parsed && parsed.code === 'OK' && !isSpam;

      if (isSuccess) {
        setSubmitted(true);
        form.reset();
      } else {
        setFormError(serverMsg || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 bg-background-50">
          <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              <div className="flex-1 lg:flex-[1.2]">
                <h2 className="text-base md:text-lg font-medium text-primary-500 mb-8 leading-relaxed">
                  {content.intro}
                </h2>

                <form
                  id="contact-form"
                  data-readdy-form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <div className="ff-field-alt">
                    <input
                      type="text"
                      name="website_alt"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-sm text-foreground-700">
                      {content.form.nameLabel}
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      placeholder={content.form.namePlaceholder}
                      className="w-full px-4 py-3 border border-background-300 rounded-sm text-sm text-foreground-950 bg-background-50 focus:outline-none focus:border-background-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      placeholder={content.form.emailPlaceholder}
                      required
                      className="w-full px-4 py-3 border border-background-300 rounded-sm text-sm text-foreground-950 bg-background-50 focus:outline-none focus:border-background-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      id="contact-phone"
                      name="subject"
                      placeholder={content.form.phonePlaceholder}
                      required
                      className="w-full px-4 py-3 border border-background-300 rounded-sm text-sm text-foreground-950 bg-background-50 focus:outline-none focus:border-background-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder={content.form.messagePlaceholder}
                      rows={4}
                      required
                      maxLength={500}
                      className="w-full px-4 py-3 border border-background-300 rounded-sm text-sm text-foreground-950 bg-background-50 focus:outline-none focus:border-background-400 resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-sm hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
                    >
                      {submitting ? 'Submitting...' : content.form.submitText}
                    </button>
                  </div>

                  {submitted && (
                    <div className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-sm border border-green-200">
                      {content.form.successMessage}
                    </div>
                  )}
                  {formError && (
                    <div className="text-sm text-red-700 bg-red-50 px-4 py-3 rounded-sm border border-red-200">
                      {formError}
                    </div>
                  )}
                </form>

                <div className="mt-8"></div>
              </div>

              <div className="flex-1 lg:flex-[0.8] flex flex-col justify-center">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full border-2 border-primary-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <i className="ri-phone-fill text-xl text-primary-500"></i>
                      </div>
                    </div>
                    <a
                      href={content.phoneHref}
                      className="text-sm text-foreground-700 font-medium hover:text-primary-600"
                    >
                      {content.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full border-2 border-primary-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <i className="ri-map-pin-fill text-xl text-primary-500"></i>
                      </div>
                    </div>
                    <span className="text-sm text-foreground-700 font-medium">
                      {content.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pl-1">
                    {content.socialLinks.map((link) => (
                      <a
                        key={`${link.platform}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors"
                        aria-label={link.platform}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className={`${link.icon} text-white text-xs`}></i>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="flex justify-center mt-2">
                    <img
                      src={resolveImageUrl(content.decorativeImage)}
                      alt=""
                      className="w-40 h-auto md:w-48 lg:w-52"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
