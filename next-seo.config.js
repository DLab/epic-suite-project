/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "EPIc Suite",
  titleTemplate: "%s | EPIc Suite",
  defaultTitle: "EPIc Suite",
  description: "Next.js + chakra-ui + TypeScript template",
  canonical: "https://nextchakra-starter.sznm.dev",
  openGraph: {
    url: "https://nextchakra-starter.sznm.dev",
    title: "EPIc Suite",
    description: "EPIc Suite GUI",
    images: [
      {
        url: "https://og-image.sznm.dev/**nextchakra-starter**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250",
        alt: "nextchakra-starter.sznm.dev og-image",
      },
    ],
    site_name: "nextchakra-starter",
  },
  twitter: {
    handle: "@sozonome",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
