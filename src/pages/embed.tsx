import React from "react";
import Head from "next/head";
import styled from "styled-components";

const StyledPageWrapper = styled.iframe`
  height: 100vh;
  width: 100%;
  border: none;
`;

const Embed = () => {
  return (
    <>
      <Head>
        <title>JSON 导图</title>
        <meta
          name="description"
          content="将Json导图嵌入的你网站."
        />
      </Head>
    </>
  );
};

export default Embed;
