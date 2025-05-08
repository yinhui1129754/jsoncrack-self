import React, { useRef, useState } from "react";
import "allotment/dist/style.css";
import useConfig from "src/store/useConfig";
import styled from "styled-components";
import useStored from "src/store/useStored";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { Loading } from "src/components/Loading";
loader.config({
    paths: { vs: "./editor/vs" },
    "vs/nls": { availableLanguages: { '*': 'zh-cn' } }
});
const EditorWrapper = styled.div`
    position:absolute;
    left:0;
    top:60px;
    height: calc(100% - 60px);
    width:100%;
`;
const editorOptions = {
    formatOnPaste: true,
    minimap: {
        enabled: false,
    },
};
function handleEditorWillMount(editor: Monaco) {

    editor.languages.json.jsonDefaults.setDiagnosticsOptions({
        allowComments: true,
        comments: "ignore",
    });
}

const RightView = () => {
    const nowSelectData = useConfig((state) => state.nowSelectData)
    const editorRef = useRef(null);
    const data = nowSelectData.data ? JSON.stringify(nowSelectData.data, null, 2) : ""
    const [value] = useState(data)
    const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    }

    const checkIsChangJson = useConfig((state) => state.checkIsChangJson)
    const setChangeJson = useConfig((state) => state.setChangeJson)
    const listJson = useConfig(state => state.listJson)
    const setListJson = useConfig(state => state.setListJson)
    // 防止在渲染触发回调
    const isProgrammaticUpdate = useRef(false);
    React.useEffect(() => {
        const data = nowSelectData.data ? JSON.stringify(nowSelectData.data, null, 2) : ""
        if (data !== value) {
            if (editorRef.current) {
                isProgrammaticUpdate.current = true; // 标记为编程更新
                (editorRef.current as any).setValue(data);
                isProgrammaticUpdate.current = false; // 重置标记（需延时确保生效）
            }
        }
    }, [nowSelectData]);
    const handleChange = (value: string | undefined) => {
        if (isProgrammaticUpdate.current) {
            return; // 跳过编程触发的更新
        }
        try {
            if (typeof value !== "undefined") {
                const data = JSON.parse(value);
                if (nowSelectData.pData) {
                    for (var i in nowSelectData.pData) {
                        if (nowSelectData.pData[i] === nowSelectData.data) {
                            nowSelectData.pData[i] = data
                            break
                        }
                    }
                    var canRemove = false
                    for (let i = 0; i < listJson.length; i++) {
                        if (canRemove) {
                            listJson.splice(i, 1)
                            i--;
                            continue
                        }
                        if (listJson[i] === nowSelectData.data) {
                            listJson[i] = data
                            canRemove = true
                        }
                    }
                    setListJson([...listJson])


                    setChangeJson({
                        newData: data,
                        beforeData: nowSelectData.data
                    })
                    checkIsChangJson()

                    nowSelectData.data = data

                }

            }

        } catch (e) { }
    }

    return (
        <EditorWrapper>


            <Editor
                height="100%"
                defaultLanguage="json"
                theme={lightmode}
                value={value}
                options={editorOptions}
                onMount={handleEditorMount}
                onChange={handleChange}
                loading={<Loading message="加载中 ..." />}
                beforeMount={handleEditorWillMount}
            />
        </EditorWrapper>
    )
};

export default RightView;
