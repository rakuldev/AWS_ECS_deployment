import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-family: "Cinzel", serif;
  font-weight: bold;
  color: inherit;
  margin-bottom: 20px;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 2.3rem;
  font-family: "Lavishly Yours", cursive;
  font-weight: bold;
  color: inherit;
  margin-bottom: 20px;
  text-align: center;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  font-family: Segoe UI;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  font-family: Segoe UI;
  border: none;
  border-radius: 5px;
  background-color: #6200ea;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3700b3;
  }
`;

const ResultsWrapper = styled.div`
  display: flex;
  gap: 50px;
  margin-top: 20px;
`;

const ResultColumn = styled.div`
  text-align: center;
`;

const TitleSmall = styled.h3`
  margin-bottom: 10px;
  font-family: Segoe UI;
  color: inherit;
`;

const Text = styled.p`
  font-size: 1.2rem;
  font-family: Segoe UI;
  color: inherit;
`;

const QuizSection = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const QuizButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  font-family: Segoe UI;
  border: none;
  border-radius: 5px;
  background-color: #ff5722;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e64a19;
  }
`;

const CatchySentence = styled.p`
  font-size: 1rem;
  font-family: "Permanent Marker", cursive;
  color: inherit;
  margin-bottom: 20px;
`;

const Page1 = ({ onRedirect }) => {
  const [synonym, setSynonym] = useState("");
  const [antonym, setAntonym] = useState("");
  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const handleQuizRedirect = () => {
    navigate("/quiz");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!input) {
      alert("Please enter a word");
      return;
    }
  
    try {
      // Make API call
      const response = await fetch("http://localhost:5000/api/vocabulary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: input }),
      });
  
      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert(errorData.error || "Server error occurred!");
        return;
      }
  
      // Parse JSON response
      const data = await response.json();
      console.log("Response Data:", data); // Debug response
      setSynonym(data.synonym);
      setAntonym(data.antonym);
    } catch (error) {
      console.error("Fetch Error:", error); // Debug fetch errors
      alert("Failed to connect to the server. Please try again later.");
    }
  };  

  return (
    <Container>
      <Title>Welcome to Synonym & Antonym Finder!</Title>
      <Subtitle>Enhance your vocabulary with ease</Subtitle>

      <InputWrapper>
        <Input
          type="text"
          placeholder="Enter a word"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </InputWrapper>

      {(synonym || antonym) && (
        <ResultsWrapper>
          <ResultColumn>
            <TitleSmall>Synonym</TitleSmall>
            <Text>{synonym}</Text>
          </ResultColumn>
          <ResultColumn>
            <TitleSmall>Antonym</TitleSmall>
            <Text>{antonym}</Text>
          </ResultColumn>
        </ResultsWrapper>
      )}

      <QuizSection>
        <CatchySentence>
          Think you're ready for the ultimate word challenge?
        </CatchySentence>
        <QuizButton onClick={handleQuizRedirect}>Take the Quiz</QuizButton>
      </QuizSection>
    </Container>
  );
};

export default Page1;
