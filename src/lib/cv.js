/**
 * One CV, named once. The hero button and the contact block both point here,
 * so the file and the saved filename can never drift apart.
 *
 * Four track-specific versions ship in public/cv. Only the full-stack one is
 * linked: it matches the role the page positions for, and a visitor choosing
 * between four CVs is a decision the site should make for them. The other
 * three stay addressable by URL so a specific application can link one
 * directly without another deploy.
 */
export const CV_PATH = '/cv/CV_Sebastian_Chirinos_FULLSTACK.pdf';

/* What the visitor sees in their downloads folder. */
export const CV_DOWNLOAD_NAME = 'CV_Sebastian_Chirinos_FULLSTACK.pdf';
