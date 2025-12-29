import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

// Global styles for light and dark mode
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
    transition: background-color 0.2s ease, color 0.2s ease;
  }
`;

// // Themes for light and dark modes
// const lightTheme = {
//   background: "#f5f5f5",
//   color: "#000",
// };

// const darkTheme = {
//   background: "#030a1c",
//   color: "#fff",
// };

const lightTheme = {
  background: "#f5f5f5",
  color: "#000",
};

const darkTheme = {
  background: "#030a1c",
  color: "#f5f5f5", // Light text color for dark mode
};


// Styled container
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ToggleWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 50px;
  height: 25px;
  background-color: ${(props) => (props.darkMode ? "#6200ea" : "#ccc")};
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    top: 2.5px; 
    left: ${(props) => (props.darkMode ? "26px" : "4px")};
    transition: left 0.2s ease-in-out;
  }
`;

const ToggleText = styled.span`
  margin: 13px;
  font-size: 0.9rem;
  color: ${(props) => props.theme.color};
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handlePreloaderFinish = () => {
    setLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      {loading && <Preloader onFinish={handlePreloaderFinish} />}
      {!loading && (
        <Container>
          <ToggleWrapper>
            <ToggleSwitch
              as="div"
              darkMode={darkMode}
              onClick={toggleDarkMode}
            ></ToggleSwitch>
            <ToggleText>{darkMode ? "Dark Mode🌙" : "Light Mode🔅"}</ToggleText>
          </ToggleWrapper>
          <Router>
          <div style={{ position: "relative", minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<Page1 />} />
              <Route path="/quiz" element={<Page2 />} />
            </Routes>
          </div>
        </Router>
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;
