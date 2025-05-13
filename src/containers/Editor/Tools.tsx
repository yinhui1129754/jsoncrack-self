import React from "react";
import { AiOutlineFullscreen } from "react-icons/ai";
import { TbSettings } from "react-icons/tb";
import { SettingsModal } from "src/containers/Modals/SettingsModal";
import useConfig from "src/store/useConfig";
import styled from "styled-components";
export const StyledTools = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row-reverse;
  height: 28px;
  padding: 4px 16px;
  background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  color: ${({ theme }) => theme.SILVER};
  box-shadow: 0 1px 0px ${({ theme }) => theme.BACKGROUND_TERTIARY};
  z-index: 1;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledToolElement = styled.button`
  display: grid;
  place-content: center;
  font-size: 20px;
  background: none;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  padding: 6px;
  border-radius: 3px;

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }

  &:hover {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    opacity: 1;
    box-shadow: none;
  }
`;

export const Tools: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const hideEditor = useConfig(state => state.hideEditor);
  const setConfig = useConfig(state => state.setConfig);
  const toggleEditor = () => setConfig("hideEditor", !hideEditor);

  return (
    <>
      <StyledTools>
        <StyledToolElement aria-label="fullscreen" onClick={toggleEditor}>
          <AiOutlineFullscreen />
        </StyledToolElement>
        <StyledToolElement
          aria-label="settings"
          onClick={() => setSettingsVisible(true)}
        >
          <TbSettings />
        </StyledToolElement>

        {/* <StyledToolElement
              aria-label="save"
              onClick={() => setDownloadVisible(true)}
            >
              <FiDownload />
            </StyledToolElement> */}
      </StyledTools>
      <SettingsModal visible={settingsVisible} setVisible={setSettingsVisible} />


    </>
  );
};
