import React from "react";
import styled, { keyframes } from "styled-components";
import { MdAutorenew } from 'react-icons/md'
interface LoadingProps {
    message?: string;
}

const rotate = keyframes`
 0% {
    transform:rotate(0deg);
  }
  100% {
    transform:rotate(360deg);
  }
`;
const LoadingWrapper = styled.div`
    position:absolute;
    width:120px;
    right:20px;
    bottom:20px;
    .icon{
        animation: ${rotate} 1s linear infinite;
    }
`
export const ToastLoading: React.FC<LoadingProps> = ({ message }) => (
    <LoadingWrapper>
        <MdAutorenew className="icon" />{message ?? "环境准备中 ..."}
    </LoadingWrapper>
);
