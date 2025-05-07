import React from "react";
import { parse } from "jsonc-parser";
import { Loading } from "src/components/Loading";
import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";
import { parser } from "src/utils/jsonParser";
import styled from "styled-components";
import Editor, { loader, Monaco } from "@monaco-editor/react";


loader.config({
    paths: { vs: "./editor/vs" },
    "vs/nls": { availableLanguages: { '*': 'zh-cn' } }
});

const editorOptions = {
    formatOnPaste: true,
    minimap: {
        enabled: false,
    },
};

const StyledWrapper = styled.div`
  display: grid;
  height: calc(100vh - 36px);
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 1fr);
`;

function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        allowComments: true,
        comments: "ignore",
    });
}

export const MonacoEditor = ({
    setHasError,
}: {
    setHasError: (value: boolean) => void;
}) => {
    const [value, setValue] = React.useState<string | undefined>("");
    const setJson = useConfig(state => state.setJson);
    const setGraphValue = useGraph(state => state.setGraphValue);

    const setJsonObj = useConfig(state => state.setJsonObj)

    const json = useConfig(state => state.json);
    const foldNodes = useConfig(state => state.foldNodes);
    const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));
    const nodeMaxLength = useStored(state => state.nodeMaxLength);

    React.useEffect(() => {
        try {
            const { nodes, edges, jsonObj } = parser(json, foldNodes, nodeMaxLength);

            setGraphValue("nodes", nodes);
            setGraphValue("edges", edges);
            setValue(json);
            setJsonObj(jsonObj)
        } catch (e) {
            let msgDiv = document.getElementById("error_message2");
            if (msgDiv != null) {
                msgDiv.innerHTML = (JSON.stringify(e))
            }
        }
    }, [foldNodes, json, setGraphValue]);

    React.useEffect(() => {
        const formatTimer = setTimeout(() => {
            if (!value) {
                setHasError(false);
                return setJson("{}");
            }
            const errors = [];
            const parsedJSON = JSON.stringify(parse(value, errors), null, 2);
            if (errors.length) return setHasError(true);
            setJson(parsedJSON);
            setHasError(false);
        }, 1200);

        return () => clearTimeout(formatTimer);
    }, [value, setJson, setHasError]);

    return (
        <StyledWrapper>
            <Editor
                height="100%"
                defaultLanguage="json"
                value={value}
                theme={lightmode}
                options={editorOptions}
                onChange={setValue}
                loading={<Loading message="加载中 ..." />}
                beforeMount={handleEditorWillMount}
            />
        </StyledWrapper>
    );
};
