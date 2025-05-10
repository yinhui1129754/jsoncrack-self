import React, { useRef, useState } from "react";
import "allotment/dist/style.css";
import useConfig from "src/store/useConfig";
import styled from "styled-components";
import useStored from "src/store/useStored";
import Editor, { loader, Monaco } from "@monaco-editor/react";
// import { Loading } from "src/components/Loading";
import toast from "react-hot-toast";
import { getType } from "src/utils/getType";
// import { Input } from "antd";
import { ToastLoading } from "src/components/Loading/toastLoading";
loader.config({
    paths: { vs: "./editor/vs" },
    "vs/nls": { availableLanguages: { '*': 'zh-cn' } }
});
const EditorWrapperParent = styled.div`
position:absolute;
left:0;
top:0px;
height: calc(100%);
width:calc(100%);
`;
const EditorWrapperChild = styled.div`
position:absolute;
left:0;
top:0px;
height: calc(100%);
width:calc(100%);
`;
const EditorWrapper = styled.div`
    position:absolute;
    left:0;
    top:36px;
    height: calc(100% - 36px);
    width:calc(100%);

`;
const TopType = styled.div`
     height:36px;
    line-height:36px;
    padding-left:15px;
    padding-right:15px;
    color:rgb(148, 163, 184);
    display:flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    >span{
        display:block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-width:30px;
    }
    &.active{
        background-color:rgba(255,255,255,0.2);
    }
    &:hover{
        background-color:rgba(255,255,255,0.1);
    }
`
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
    const setJsonNoHooks = useConfig(state => state.setJsonNoHooks)
    const jsonObj = useConfig(state => state.jsonObj)
    const editorRef = useRef(null);
    const data = nowSelectData.data ? JSON.stringify(nowSelectData.data, null, 2) : ""
    const [value, setValue] = useState(data)
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
    const [type, setType] = useState(getType(nowSelectData))
    React.useEffect(() => {
        const data = nowSelectData.data ? JSON.stringify(nowSelectData.data, null, 2) : ""
        var nowType = getType(nowSelectData.data)
        if (data !== value) {
            if (editorRef.current) {
                isProgrammaticUpdate.current = true; // 标记为编程更新
                setValue(data);
            } else {
                setValue(data)
            }

            setType(nowType)
        }
    }, [nowSelectData]);
    const handleChange = (value: string | undefined) => {
        if (isProgrammaticUpdate.current) {
            isProgrammaticUpdate.current = false; // 重置标记（需延时确保生效）
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
                    setJsonNoHooks(JSON.stringify(jsonObj, null, 2))
                }

            }

        } catch (e) {
            toast.error("json 格式化报错请检查！！")
        }
    }

    return (
        <EditorWrapperParent>
            {
                (nowSelectData.data) ? (<EditorWrapperChild>
                    <TopType><span>类型</span><span>{type}</span></TopType>
                    <EditorWrapper>
                        <Editor
                            height={(type === "array" || type === "object") ? "100%" : "60px"}
                            defaultLanguage="json"
                            theme={lightmode}
                            defaultValue={value}
                            value={value}
                            options={editorOptions}
                            onMount={handleEditorMount}
                            onChange={handleChange}

                            loading={<ToastLoading message="加载种 ...." />}
                            beforeMount={handleEditorWillMount}
                        />
                    </EditorWrapper>
                </EditorWrapperChild>) : (<EditorWrapperChild><TopType><span>暂无选择</span><span></span></TopType></EditorWrapperChild>)
            }


        </EditorWrapperParent>
    )
};

export default RightView;
