import React from "react";
import Home from "./screens/home.jsx";
import Header from "./components/Header";
import styled from "styled-components";

const Main = styled.div`
  padding: 8rem 8rem 0 8rem;
  min-height: 100%;
`;

function App() {
  return (
    <div>
      <Header />
      <Main>
        <Home />
      </Main>
    </div>
  );
}

export default App;
