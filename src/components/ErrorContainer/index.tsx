import React from "react";
import { MdReportGmailerrorred, MdOutlineCheckCircleOutline } from "react-icons/md";
import styled from "styled-components";

const StyledErrorWrapper = styled.div`
  z-index: 1;
`;

const StyledErrorExpand = styled.div<{ error: boolean }>`
  position: relative;
  display: flex;
  width: 90%;
  padding: 4px 0 0 16px;
  height: 28px;
  border-radius: 0;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme, error }) => (error ? theme.TEXT_DANGER : theme.TEXT_POSITIVE)};
  pointer-events: ${({ error }) => !error && "none"};
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  box-shadow: 0 1 0 ${({ theme }) => theme.BACKGROUND_TERTIARY};
`;

const StyledTitle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  font-size: 16px;
`;

export const ErrorContainer = ({ hasError }: { hasError: boolean }) => {
  return (
    <StyledErrorWrapper>
      <StyledErrorExpand error={hasError}>
        <StyledTitle>
          {hasError ? (
            <MdReportGmailerrorred size={18} />
          ) : (
            <MdOutlineCheckCircleOutline size={18} />
          )}
          {hasError ? "非法JSON" : "有效JSON"}
        </StyledTitle>
      </StyledErrorExpand>
    </StyledErrorWrapper>
  );
};
