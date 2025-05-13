import React from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { JsonEditor } from "src/containers/Editor/JsonEditor";
import useConfig from "src/store/useConfig";
import styled from "styled-components";
import { ListEditor } from "./ListEditor";
import RightView from "./ListEditor/rightView";

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
`;

const Panes: React.FC = () => {
  const hideEditor = useConfig(state => state.hideEditor);
  const setConfig = useConfig(state => state.setConfig);
  const isMobile = window.innerWidth <= 768;

  React.useEffect(() => {
    if (isMobile) setConfig("hideEditor", true);
  }, [isMobile, setConfig]);

  return <StyledEditor proportionalLayout={false} vertical={isMobile}>
    <Allotment.Pane
      preferredSize={isMobile ? "100%" : 300}
      minSize={hideEditor ? 0 : 350}
      maxSize={isMobile ? Infinity : 450}
      visible={!hideEditor}
    >
      <JsonEditor />
    </Allotment.Pane>
    <Allotment.Pane minSize={20} maxSize={Infinity}>
      <ListEditor />
    </Allotment.Pane>
    <Allotment.Pane minSize={350} maxSize={450}>
      <RightView />
    </Allotment.Pane>
  </StyledEditor>

};

export default Panes;
