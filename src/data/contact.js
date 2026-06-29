/**
 * Single source of truth for all contact information shown on the site.
 * Importing this keeps the email, mobile, WhatsApp, and Instagram links
 * consistent across the CTA section, Footer, FloatingWhatsApp, and CartDrawer.
 */
export const CONTACT = {
  email: "bikashtalukder040@gmail.com",
  // Bangladeshi mobile — kept as a raw digit string so it can be reused
  // for both the tel: link and the wa.me link with the country code prefix.
  mobile: "01926240062",
  mobileCountryCode: "+880", // BD country code
  whatsappMessage:
    "Hi Bikash — I'd love to talk about a coffee / restaurant website concept.",
  instagram: "https://www.instagram.com/talukder_20/",
};

/* Build the E.164-style national number used by wa.me (no leading 0,
   no "+", no spaces). Example: "01926240062" + "+880" → "8801926240062". */
const nationalNumberForWa = () =>
  `${CONTACT.mobileCountryCode.replace("+", "")}${CONTACT.mobile.replace(/^0/, "")}`;

/* Stock "let's chat" link — used by FloatingWhatsApp + CTA section. */
export const whatsappLink = () =>
  `https://wa.me/${nationalNumberForWa()}?text=${encodeURIComponent(
    CONTACT.whatsappMessage
  )}`;

/* Same idea but with a custom message — used by the CartDrawer's
   checkout screen so users can pre-fill the order summary into WA. */
export const whatsappLinkWithMessage = (message) =>
  `https://wa.me/${nationalNumberForWa()}?text=${encodeURIComponent(message)}`;

/* tel: link — "+8801926240062". */
export const telLink = () => `${CONTACT.mobileCountryCode}${CONTACT.mobile.replace(/^0/, "")}`;

/* mailto: link with optional subject + body. */
export const mailtoLink = ({ subject, body } = {}) => {
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const q = params.length ? `?${params.join("&")}` : "";
  return `mailto:${CONTACT.email}${q}`;
};