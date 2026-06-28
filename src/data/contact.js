/**
 * Single source of truth for all contact information shown on the site.
 * Importing this keeps the email, mobile, WhatsApp, and Instagram links
 * consistent across the CTA section and Footer.
 */
export const CONTACT = {
  email: "bikashtalukder040@gmail.com",
  // Bangladeshi mobile — kept as a raw digit string so it can be reused
  // for both the tel: link and the wa.me link with the country code prefix.
  mobile: "01926240062",
  mobileCountryCode: "+880", // BD country code
  whatsappMessage: "Hi Bikash — I'd love to talk about a coffee / restaurant website concept.",
  instagram: "https://www.instagram.com/talukder_20/",
};

export const whatsappLink = () =>
  `https://wa.me/${CONTACT.mobileCountryCode.replace("+", "")}${CONTACT.mobile.replace(/^0/, "")}?text=${encodeURIComponent(
    CONTACT.whatsappMessage
  )}`;

export const telLink = () => `${CONTACT.mobileCountryCode}${CONTACT.mobile.replace(/^0/, "")}`;