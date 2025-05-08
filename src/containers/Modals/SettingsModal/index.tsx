import React from "react";
import { Modal } from "src/components/Modal";
import Toggle from "src/components/Toggle";
import useStored from "src/store/useStored";
import styled from "styled-components";
import shallow from "zustand/shallow";
import { Slider } from 'antd';
import useConfig from "src/store/useConfig";

const StyledToggle = styled(Toggle)`
  flex-flow: row-reverse;
  background: black;
`;
const StyledModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SettingsModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visible, setVisible }) => {
  const lightmode = useStored(state => state.lightmode);
  const setLightTheme = useStored(state => state.setLightTheme);
  const [toggleHideCollapse, hideCollapse] = useStored(
    state => [state.toggleHideCollapse, state.hideCollapse],
    shallow
  );
  const [toggleShowListMode, showListMode] = useStored(
    state => [state.toggleShowListMode, state.showListMode],
    shallow
  );
  const [toggleHideChildrenCount, hideChildrenCount] = useStored(
    state => [state.toggleHideChildrenCount, state.hideChildrenCount],
    shallow
  );

  const [nodeMaxLength, setNodeMaxLength] = useStored(
    state => [state.nodeMaxLength, state.setNodeMaxLength]
  );


  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>设置</Modal.Header>
      <Modal.Content>
        <StyledModalWrapper>
          <StyledToggle onChange={toggleHideCollapse} checked={hideCollapse}>
            隐藏折叠/展开按钮
          </StyledToggle>
          <StyledToggle onChange={toggleShowListMode} checked={showListMode}>
            列表显示模式
          </StyledToggle>
          <StyledToggle
            onChange={toggleHideChildrenCount}
            checked={hideChildrenCount}
          >
            隐藏子数量统计
          </StyledToggle>
          <StyledToggle
            onChange={() => setLightTheme(!lightmode)}
            checked={!lightmode}
          >启用夜间模式
          </StyledToggle>
          <span>节点值最大长度
            <Slider
              step={1}
              max={200}
              min={1}
              defaultValue={nodeMaxLength}
              tooltip={{ open: true }}
              onChange={(v) => setNodeMaxLength(v)} />
          </span>
        </StyledModalWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
