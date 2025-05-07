import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiTool } from "react-icons/fi";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import styled from "styled-components";
// import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import useConfig from "src/store/useConfig";
interface NodeModalProps {
  selectedNode: NodeData;
  visible: boolean;
  closeModal: () => void;
}

const StyledTextarea = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 200px;

  padding: 10px;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  outline: none;
  border-radius: 4px;
  line-height: 20px;
  border: none;
`;

export const NodeModal = ({ selectedNode, visible, closeModal }: NodeModalProps) => {

  const renderData = (selectedNode ? selectedNode.text : [])


  const nodeData = Array.isArray(renderData)
    ? Object.fromEntries(renderData)
    : renderData;

  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);
  const json = useConfig(state => state.getJsonObj())
  const setJson = useConfig(state => state.setJson)
  let showValue = JSON.stringify(nodeData, null, 2)
  const [text, setText] = useState(showValue);
  if (selectedNode && selectedNode.type === "array") {
    showValue = showValue.replace(/^\{/g, "[")
    showValue = showValue.replace(/\}$/g, "]")
  }
  const handleClipboard = () => {
    toast.success("内容复制成功!");
    navigator.clipboard.writeText(JSON.stringify(nodeData));
    // closeModal();
  };

  const handleChange = () => {

    var rootJson = json
    var changeSucc = false
    try {

      var runJson = selectedNode.jsonData
      if (selectedNode.type === "object") {
        var inputJsonData = JSON.parse(text)
        if (Array.isArray(selectedNode.text)) {

          for (var i in runJson) {
            var type = typeof runJson[i];
            if (type === "boolean" ||
              type === "number" ||
              type === "string" ||
              type === "undefined"
            ) {
              delete runJson[i]
            }
          }
          Object.assign(runJson, inputJsonData)
          changeSucc = true
        } else {
          // console.log(text, showValue)
          runJson[JSON.parse(text)] = runJson[JSON.parse(showValue)]
          delete runJson[JSON.parse(showValue)]
          changeSucc = true
        }

      } else if (selectedNode.type === "array") {
        var useTxt = text
        if (selectedNode && selectedNode.type === "array") {
          useTxt = useTxt.replace(/^\[/g, "{")
          useTxt = useTxt.replace(/\]$/g, "}")
        }
        var inputJsonData = JSON.parse(useTxt)
        if (Array.isArray(selectedNode.text)) {
          Object.assign(runJson, inputJsonData)
          changeSucc = true
        } else {

          toast.error("数组key无法修改")
        }
      } else {
      }

      if (changeSucc) {

        toast.success("内容修改成功!")
        closeModal();
      }
      setJson(JSON.stringify(rootJson))

    } catch {

      toast.error("json输入错误")
    }
    console.log(edges, nodes, selectedNode, renderData, json)
    // closeModal()
  }
  const handleInput = (e) => {
    setText(e.target.value)
  }
  return (
    <Modal visible={visible} setVisible={closeModal}>
      <Modal.Header>节点内容</Modal.Header>
      <Modal.Content>
        <StyledTextarea
          // style={{ display: "none" }}
          defaultValue={showValue}
          onInput={handleInput}
        // readOnly
        />
      </Modal.Content>
      <Modal.Controls setVisible={closeModal}>
        <Button status="SECONDARY" onClick={handleClipboard}>
          <FiCopy size={16} /> 复制
        </Button>
        <Button status="SECONDARY" onClick={handleChange}>
          <FiTool size={16} /> 修改
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
