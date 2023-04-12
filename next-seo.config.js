/** @type {import('next-seo').DefaultSeoProps} */
const EPIC = "EPIc Suite";

const defaultSEOConfig = {
    title: `${EPIC}`,
    titleTemplate: `%s | ${EPIC}`,
    defaultTitle: `${EPIC}`,
    description: "Epidemiology + tools + spatial",
    canonical: "https://cv19gm.org",
    openGraph: {
        url: "https://cv19gm.org",
        title: "EPIc Suite",
        description: `${EPIC} GUI`,
        // images: [
        //   {
        //     url: "https://og-image.sznm.dev/**nextchakra-starter**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250",
        //     alt: "nextchakra-starter.sznm.dev og-image",
        //   },
        // ],
        site_name: "Epic Suite",
    },
};

export default defaultSEOConfig;
