/**
 * Mirror of /src/data/contact.js — used by the Worker to build
 * pre-filled WhatsApp links. Kept in sync manually; if you change
 * one, change the other.
 *
 * (We don't share the Vite file because Workers compile from the
 * `worker/` subtree only — the `src/data/` tree is React-only.)
 */
export const CONTACT = {
  email: "bikashtalukder040@gmail.com",
  mobile: "01926240062",
  mobileCountryCode: "+880", // BD country code
  instagram: "https://www.instagram.com/talukder_20/",
};
