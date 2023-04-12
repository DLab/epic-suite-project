/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AppProps } from "next/app";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import "@fontsource/lexend/latin.css";
import { Provider } from "react-redux";

import defaultSEOConfig from "../../next-seo.config";
import Layout from "components/layout";
import store from "store/store";
import createEmotionCache from "styles/createEmotionCache";
import customTheme from "styles/customTheme";
import "styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const MyApp = ({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}: MyAppProps) => {
    return (
        <CacheProvider value={emotionCache}>
            <ChakraProvider theme={customTheme}>
                <Head>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                    />
                </Head>
                <DefaultSeo {...defaultSEOConfig} />
                <Layout>
                    <Provider store={store}>
                        <Component {...pageProps} />
                    </Provider>
                </Layout>
            </ChakraProvider>
        </CacheProvider>
    );
};

MyApp.defaultProps = {
    emotionCache: clientSideEmotionCache,
};

export default MyApp;
