import React from "react";
import Link from "next/link";
import {
    AiOutlineDelete,
    AiOutlineSave,
    AiOutlineFileAdd,
    AiOutlineEdit,
} from "react-icons/ai";
import { Tooltip } from "src/components/Tooltip";
import { ClearModal } from "src/containers/Modals/ClearModal";
import { ImportModal } from "src/containers/Modals/ImportModal";
import useConfig from "src/store/useConfig";
import styled from "styled-components";
import shallow from "zustand/shallow";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  padding: 4px;
  border-right: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};

  @media only screen and (max-width: 768px) {
    flex-direction: row;
    width: 100%;
  }
`;

const StyledElement = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  width: fit-content;
  color: ${({ theme }) => theme.SIDEBAR_ICONS};
  cursor: pointer;

  svg {
    padding: 12px 8px;
    vertical-align: middle;
  }

  a {
    display: flex;
  }

  &:hover :is(a, svg) {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  @media only screen and (max-width: 768px) {
    font-size: 22px;

    svg {
      padding: 8px 4px;
      vertical-align: middle;
    }
  }
`;

const StyledText = styled.span<{ secondary?: boolean }>`
  color: ${({ theme, secondary }) =>
        secondary ? theme.INTERACTIVE_HOVER : theme.ORANGE};
`;


const StyledTopWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .mobile {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    justify-content: space-evenly;
    flex-direction: row;

    .mobile {
      display: initial;
    }

    .desktop {
      display: none;
    }
  }
`;

// const StyledBottomWrapper = styled.nav`
//   display: flex;
//   justify-content: space-between;
//   flex-direction: column;
//   align-items: center;
//   width: 100%;
//
//   @media only screen and (max-width: 768px) {
//     display: none;
//   }
// `;

const StyledLogo = styled.a`
  color: ${({ theme }) => theme.FULL_WHITE};
  padding: 8px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};

  @media only screen and (max-width: 768px) {
    border-bottom: 0;
  }
`;

export const Sidebar: React.FC = () => {
    const [uploadVisible, setUploadVisible] = React.useState(false);
    const [clearVisible, setClearVisible] = React.useState(false);

    const getJson = useConfig(state => state.getJson);
    const setConfig = useConfig(state => state.setConfig);

    const [hideEditor] = useConfig(
        state => [state.hideEditor],
        shallow
    );

    const handleSave = () => {
        var j = getJson()
        var b = new Blob([j])
        var bUrl = URL.createObjectURL(b)
        var a = document.createElement("a")
        a.href = bUrl
        a.download = "导出.json"
        a.click()
    };




    return (
        <StyledSidebar>
            <StyledTopWrapper>
                <Link passHref href="/editor">
                    <StyledElement as={StyledLogo}>
                        <StyledText>J</StyledText>
                        <StyledText secondary>C</StyledText>
                    </StyledElement>
                </Link>
                <Tooltip className="mobile" title="编辑 JSON">
                    <StyledElement onClick={() => setConfig("hideEditor", !hideEditor)}>
                        <AiOutlineEdit />
                    </StyledElement>
                </Tooltip>
                <Tooltip title="添加">
                    <StyledElement onClick={() => setUploadVisible(true)}>
                        <AiOutlineFileAdd />
                    </StyledElement>
                </Tooltip>

                <Tooltip className="desktop" title="保存">
                    <StyledElement onClick={handleSave}>
                        <AiOutlineSave />
                    </StyledElement>
                </Tooltip>

                <Tooltip title="清除">
                    <StyledElement onClick={() => setClearVisible(true)}>
                        <AiOutlineDelete />
                    </StyledElement>
                </Tooltip>
            </StyledTopWrapper>
            <ImportModal visible={uploadVisible} setVisible={setUploadVisible} />
            <ClearModal visible={clearVisible} setVisible={setClearVisible} />
        </StyledSidebar>
    );
};
