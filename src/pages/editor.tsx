import React from "react";
import { Sidebar } from "src/components/Sidebar";
import Panes from "src/containers/Editor/Panes";
import styled from "styled-components";

export const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;

  @media only screen and (max-width: 768px) {
    position: fixed;
    height: -webkit-fill-available;
    flex-direction: column;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const EditorPage: React.FC = () => {
  return (
    <StyledEditorWrapper>
      <StyledPageWrapper>
        <Sidebar />
        <StyledEditorWrapper>
          <Panes />
        </StyledEditorWrapper>
      </StyledPageWrapper>
    </StyledEditorWrapper>
  );
};

export default EditorPage;
