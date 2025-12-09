import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: "Cinzel", serif;
  font-weight: bold;
  color: inherit;
  margin-bottom: 20px;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-family: "Lavishly Yours", cursive;
  font-weight: bold;
  color: inherit;
  margin-bottom: 40px;
  text-align: center;
`;

const FormWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;

const Dropdown = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 160px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #6200ea;
  color: white;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transition: background-color 0.3s ease;
  margin-top: 20px; /* To add space between buttons */
  
  &:hover {
    background-color: #3700b3;
  }
`;

const ResultWrapper = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  font-family: "Permanent Marker", cursive;
  color: ${(props) => (props.isCorrect ? "green" : "red")};
`;

const AnswerWrapper = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  font-family: "Permanent Marker";
  color: ${(props) => (props.Answers ? "green" : "red")};
`;

const QuizSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
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

const Page2 = () => {
  const [word, setWord] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setdbAnswers] = useState("");
  const [dropdownValue, setDropdownValue] = useState("synonym");
  const [result, setResult] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const navigate = useNavigate();

  const handleQuizRedirect = () => {
    navigate("/");
  };

  useEffect(() => {
    // Fetch a random word when the component mounts
    fetchRandomWord();
  }, []);

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/get-next-word");
      const data = await response.json();
      setWord(data.word); // Set the random word to the state
      setUserAnswer(""); // Clear the user's previous answer
      setResult(""); // Clear any previous result
      setdbAnswers("")
      setIsCorrect(null); // Reset correctness status
    } catch (error) {
      console.error("Error fetching random word:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(""); // Clear previous result
    setdbAnswers("")
    setIsCorrect(null); // Reset correctness status

    try {
      const response = await fetch("http://localhost:5000/validate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: word,
          answer: userAnswer,
          type: dropdownValue, // Send synonym/antonym type from the dropdown
        }),
      });
      const data = await response.json();
      if (data.isValid) {
        setResult("Correct! Well done.");
        setdbAnswers(data.Answers);
        setIsCorrect(true);
      } else {
        setResult("Incorrect, please try again.");
        setIsCorrect(false);
        setdbAnswers(data.Answers);
      }
    } catch (error) {
      console.error("Error validating answer:", error);
      setResult("Error occurred while validating.");
      setdbAnswers("")
      setIsCorrect(false);
    }
  };

  return (
    <Container>
      <Title>Word Quiz</Title>
      <Subtitle>Validate your knowledge of synonyms and antonyms!</Subtitle>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <QuizSection>
          <form onSubmit={handleSubmit}>
            <FormWrapper>
              <Input
                type="text"
                value={word}
                disabled
                placeholder="Quiz Word"
              />
              <Dropdown
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}
              >
                <option value="synonym">Synonym</option>
                <option value="antonym">Antonym</option>
              </Dropdown>
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
              />
            </FormWrapper>

            <Button type="submit" >Validate Answer</Button>
          </form>

          {result && (
            <ResultWrapper isCorrect={isCorrect}>
              {result}
            </ResultWrapper>
          )}
          {answers && (
            <AnswerWrapper Answers={answers}>
              {answers}
            </AnswerWrapper>
          )}
          <Button onClick={fetchRandomWord}>Next Word</Button>
        </QuizSection>
      )}
       <QuizSection>
        <CatchySentence>
          Need more practice?
        </CatchySentence>
        <QuizButton onClick={handleQuizRedirect}>Take the Quiz</QuizButton>
      </QuizSection>
    </Container>
  );
};

export default Page2;