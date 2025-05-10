import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  ::-webkit-scrollbar {
    width: 6px;   /* 垂直滚动条宽度 */
    height: 6px;  /* 水平滚动条宽度 */
    background: transparent; /* 背景透明，模拟自动隐藏 */
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3); /* 半透明灰色 */
    border-radius: 3px;             /* 圆角 */
    transition: background 0.3s;    /* 过渡效果 */
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  ::-webkit-scrollbar-thumb:active {
    background: rgba(0, 0, 0, 0.7);
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: ${({ theme }) => theme.FULL_WHITE};
    font-family: 'Catamaran', sans-serif;
    font-weight: 400;
    font-size: 16px;
    scroll-behavior: smooth;
    scrollbar-width: thin; 
    height: 100%;

    background-color: #000000;
    opacity: 1;
    background-image: radial-gradient(#414141 0.5px, #000000 0.5px);
    background-size: 10px 10px;

    @media only screen and (min-width: 768px) {
      background-color: #000000;
      opacity: 1;
      background-image: radial-gradient(#414141 0.5px, #000000 0.5px);
      background-size: 15px 15px;
    }
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }

  .hide {
    display: none;
  }
  
  a {
    text-decoration: none;
    color: unset;
    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }

  button {
    border: none;
    outline: none;
    background: transparent;
    width: fit-content;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }

  #carbonads * {
  margin: initial;
  padding: initial;
  line-height: initial;
  }

  #carbonads {
    --carbon-font-size: 16px;
    --carbon-padding-size: 12px;
    border-radius: 4px;
    overflow: hidden;
  }

  #carbonads {
    display: inline-block;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      Helvetica, Arial, sans-serif;
    font-size: var(--carbon-font-size);
  }

  #carbonads > span {

    min-width: 18.75em;
    max-width: clamp(18.75em, 22.5em, 24.5em);
    min-height: 100px;
    background-color: ${({ theme }) => theme.BACKGROUND_SECONDARY};
    box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.085),
      0 0 2px hsl(0deg 0% 0% / 0.085),
      0 0 4px hsl(0deg 0% 0% / 0.085),
      0 0 8px hsl(0deg 0% 0% / 0.085);
  }

  #carbonads a {
    text-decoration: none;
    color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  }

  #carbonads a:hover {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  #carbonads span {
    display: block;
    position: relative;
  }

  #carbonads .carbon-wrap {
    display: flex;
  }

  #carbonads .carbon-img {
    height: 100px;
    width: 130px;
  }

  #carbonads .carbon-img img {
    display: block;
  }

  #carbonads .carbon-text {
    padding: 0.625em 1em;

    font-size: 0.8125em;
    margin-bottom: 1em;
    line-height: 1.4;
    text-align: left;
  }

  #carbonads .carbon-poweredby {
    display: block;
    padding: 6px 8px;
    color: ${({ theme }) => theme.TEXT_NORMAL};
    background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.1ch;
    font-weight: 600;
    font-size: 0.5em;
    line-height: 1;
    border-top-left-radius: 3px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

export default GlobalStyle;
