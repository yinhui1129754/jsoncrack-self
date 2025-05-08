import React from "react";
import styled from "styled-components";
import { Tools } from "../Tools";
import { List } from "./list";
import useConfig from "src/store/useConfig";
import { parser } from "src/utils/jsonParser";
import { json } from "stream/consumers";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;
const ListEditorWrapper = styled.div`
    height:calc(100% - 36px);
    width:100%;
    position:relative;
    overflow:auto;
`
export const ListEditor: React.FC = () => {
    // const setJson = useConfig(state => state.setJson);
    const setGraphValue = useGraph(state => state.setGraphValue);
    const setListJson = useConfig(state => state.setListJson)
    const setJsonObj = useConfig(state => state.setJsonObj)
    const listJson = useConfig(state => state.listJson)

    const json = useConfig(state => state.json);
    const foldNodes = useConfig(state => state.foldNodes);
    const nodeMaxLength = useStored(state => state.nodeMaxLength);
    React.useEffect(() => {
        try {

            const { jsonObj } = parser(json, foldNodes, nodeMaxLength);
            setJsonObj(jsonObj)
            setListJson([jsonObj])

        } catch (e) {
            let msgDiv = document.getElementById("error_message2");
            if (msgDiv != null) {
                msgDiv.innerHTML = (JSON.stringify(e))
            }
        }
    }, [foldNodes, json, setGraphValue]);
    return (
        <StyledEditorWrapper>
            <Tools />
            <ListEditorWrapper>
                {
                    listJson.map((item, index) => {
                        return <List data={item} key={index} index={index} />
                    })
                }
            </ListEditorWrapper>
        </StyledEditorWrapper>
    );
};
