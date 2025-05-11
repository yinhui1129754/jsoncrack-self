import React, { useRef } from "react";
import { parse } from "jsonc-parser";
// import { Loading } from "src/components/Loading";
import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";
import { parser } from "src/utils/jsonParser";
import styled from "styled-components";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { ToastLoading } from "../Loading/toastLoading";


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
var timeIndex = -1
export const MonacoEditor = ({
    setHasError,
}: {
    setHasError: (value: boolean) => void;
}) => {
    const [value, setValue] = React.useState<string | undefined>("");
    const setJson = useConfig(state => state.setJson);
    // const setJsonNoHooks = useConfig(state => state.setJsonNoHooks);
    // const checkIsTriggerUpdate = useConfig(state => state.checkIsTriggerUpdate)
    const setGraphValue = useGraph(state => state.setGraphValue);
    const setListJson = useConfig(state => state.setListJson)
    const setJsonObj = useConfig(state => state.setJsonObj)

    const json = useConfig(state => state.getJson());
    const isTriggerUpdate = useConfig(state => state.isTriggerUpdate)
    const foldNodes = useConfig(state => state.foldNodes);
    const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));
    const nodeMaxLength = useStored(state => state.nodeMaxLength);
    const showListMode = useStored(state => state.showListMode)
    // 防止在渲染触发回调
    const isProgrammaticUpdate = useRef(false);
    const editorRef = useRef(null);
    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    }
    React.useEffect(() => {
        try {

            const { nodes, edges, jsonObj } = parser(json, foldNodes, nodeMaxLength);
            isProgrammaticUpdate.current = true;
            setValue(json);
            setJsonObj(jsonObj)
            if (showListMode) {
                setListJson([jsonObj])

            } else {
                setGraphValue("nodes", nodes);
                setGraphValue("edges", edges);
            }

        } catch (e) {
            let msgDiv = document.getElementById("error_message2");
            if (msgDiv != null) {
                msgDiv.innerHTML = (JSON.stringify(e))
            }
        }
    }, [foldNodes, isTriggerUpdate, setGraphValue]);
    React.useEffect(() => {
        isProgrammaticUpdate.current = true;

        setValue(json);
    }, [json]);

    const handleChange = (v) => {
        window.clearTimeout(timeIndex)
        setValue(v)
        if (isProgrammaticUpdate.current) {
            isProgrammaticUpdate.current = false
            return;
        }
        timeIndex = window.setTimeout(() => {
            if (!v) {
                setHasError(false);
                return setJson("{}");
            }
            const errors = [];
            const parsedJSON = JSON.stringify(parse(v, errors), null, 2);
            if (errors.length) return setHasError(true);
            setJson(parsedJSON);
            setHasError(false);
        }, 1200);
    }

    return (
        <StyledWrapper>
            <Editor
                height="100%"
                defaultLanguage="json"
                value={value}
                theme={lightmode}
                options={editorOptions}
                onChange={handleChange}
                onMount={handleEditorMount}
                loading={<ToastLoading message="加载中 ..." />}
                beforeMount={handleEditorWillMount}
            />
        </StyledWrapper>
    );
};
