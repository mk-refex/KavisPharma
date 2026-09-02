import type { ContactContent } from "@/services/api";

export const defaultContactContent: ContactContent = {
  intro:
    "We value your visit and look forward to connecting further to discuss advancements in healthcare. Please reach out to us here !",
  phone: "+1(281) 240-1000",
  phoneHref: "tel:+12812401000",
  address: "12720 Dairy Ashford Rd Sugar Land,TX 77478",
  form: {
    nameLabel: "Name",
    namePlaceholder: "Name",
    emailPlaceholder: "Email ID",
    phonePlaceholder: "Contact No.",
    messagePlaceholder: "Your Message",
    submitText: "Submit Form",
    successMessage: "Thank you! Your message has been submitted successfully.",
  },
  socialLinks: [
    {
      platform: "Facebook",
      url: "https://facebook.com",
      icon: "ri-facebook-fill",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com",
      icon: "ri-twitter-fill",
    },
  ],
  decorativeImage:
    "https://kavispharma.com/wp-content/uploads/2024/06/Semicircle.png",
};
