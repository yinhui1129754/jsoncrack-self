import React from "react";
import { Modal } from "src/components/Modal";
import Toggle from "src/components/Toggle";
import useStored from "src/store/useStored";
import styled from "styled-components";

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



  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>设置</Modal.Header>
      <Modal.Content>
        <StyledModalWrapper>

          <StyledToggle
            onChange={() => setLightTheme(!lightmode)}
            checked={!lightmode}
          >启用夜间模式
          </StyledToggle>
        </StyledModalWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
