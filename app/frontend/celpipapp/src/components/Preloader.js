import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Animations for entering and exiting
const moveFromBottom = keyframes`
  0% { transform: translateY(100px); opacity: 0; }
  50% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
`;

const moveToTop = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100px); opacity: 0; }
`;

// Wrapper for the entire preloader
const PreloaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

// Container for the text
const TextContainer = styled.div`
  display: flex;
  gap: 1rem; /* Horizontal spacing between words */
`;

// Individual text styles with animation
const Text = styled.div`
  font-size: 2rem;
  color: white;
  font-family: Arial, sans-serif;
  animation: ${(props) =>
      props.isExiting ? moveToTop : moveFromBottom}
    2s ease-in-out ${(props) => props.delay}s forwards;
`;

const Preloader = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start the exit animation after all "enter" animations finish
    const exitTimeout = setTimeout(() => {
      setIsExiting(true);
    }, 3000); // 3 seconds for all words to enter

    // Finish the preloader after all animations are done
    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 6000); // 6 seconds for enter + exit animations

    return () => {
      clearTimeout(exitTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <PreloaderWrapper>
      <TextContainer>
        {/* Words enter first, then exit */}
        <Text delay={0} isExiting={isExiting}>Developed.</Text>
        <Text delay={1} isExiting={isExiting}>With.</Text>
        <Text delay={2} isExiting={isExiting}>Love❤️</Text>
      </TextContainer>
    </PreloaderWrapper>
  );
};

export default Preloader;