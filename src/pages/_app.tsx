import React from "react";
import type {AppProps} from "next/app";
import {useRouter} from "next/router";
import {init} from "@sentry/nextjs";
// import { decompress } from "compress-json";
import {Toaster} from "react-hot-toast";
import GlobalStyle from "src/constants/globalStyle";
import {darkTheme, lightTheme} from "src/constants/theme";
import useConfig from "src/store/useConfig";
import useStored from "src/store/useStored";
// import { isValidJson } from "src/utils/isValidJson";
import {ThemeProvider} from "styled-components";
import {isValidJson} from "../utils/isValidJson";

if (process.env.NODE_ENV !== "development") {
    init({
        tracesSampleRate: 0.5,
    });
}

function JsonCrack({Component, pageProps}: AppProps) {
    const {query, pathname} = useRouter();
    const setLightMode = useStored(state => state.setLightTheme);
    const lightMode = useStored(state => state.lightmode);
    const setJson = useConfig(state => state.setJson);
    const getJson = useConfig(state => state.getJson);
    const [isRendered, setRendered] = React.useState(false);
    React.useEffect(() => {
        let timer = setInterval(() => {
            window.localStorage.setItem("json_crack_history", getJson());
        }, 1000);
        let history = window.localStorage.getItem("json_crack_history");
        if (history != null) {
            setJson(history + "");
        }

        let payLoadScan = setInterval(() => {
            let payload = window.localStorage.getItem("json_crack_payload");
            if (payload != null) {
                window.localStorage.removeItem("json_crack_payload")
                let validJson = isValidJson(payload + "");
                if (validJson) {
                    setJson(validJson);
                }
            }
        }, 300);
        setLightMode(eval("!utools.isDarkColors()"));
        return () => {
            clearInterval(timer)
            clearInterval(payLoadScan)
        }
    }, [getJson, setJson, setLightMode]);

    React.useEffect(() => {
        setRendered(true);
    }, []);

    if (isRendered)
        return (
            <>
                <ThemeProvider theme={lightMode ? lightTheme : darkTheme}>
                    <GlobalStyle/>
                    <Component {...pageProps} />
                    <Toaster
                        position="bottom-right"
                        containerStyle={{
                            right: 60,
                        }}
                        toastOptions={{
                            style: {
                                background: "#4D4D4D",
                                color: "#B9BBBE",
                            },
                        }}
                    />
                </ThemeProvider>
            </>
        );
}

export default JsonCrack;
