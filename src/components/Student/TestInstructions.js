// TestInstructions component used to get test instructions before taking the test
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const TestInstructions = () => {
  // agreed variable usestate to store boolean value of agreed
  const [agreed, setAgreed] = useState(false);
  // navigate varaible used to navigating to different paths
  const navigate = useNavigate();
  // handleAgreeChange function to set boolean value of agreed variable
  const handleAgreeChange = () => {
    setAgreed(!agreed);
  };

  // handleStartTest function to check the condition to take the test
  const handleStartTest = () => {
    // if agreed variable is true then it'll navigates to streamRecommendationTest route
    if (agreed) {
      navigate("/streamRecommendationTest");
    } else {
      // Display an error message or prevent starting the test
      console.log("Please agree to the instructions before starting the test.");
    }
  };

  return (
    <div>
      <div className='test-instructions'>
        <div>
          <h2 className="heading">Online Test Instructions</h2>
          <div className='instruction-container'>
            <h1>Instructions</h1>
            <p className='instructions'>
              Ensure you have a stable internet connection throughout the test.
              <br />
              Use a desktop or laptop computer for the best experience. Mobile
              devices are not recommended.
              <br />
              Close any unnecessary applications or tabs on your computer.
              <br />
              Answer each question to the best of your ability.
              <br />
              If you encounter any technical issues during the test, notify your
              instructor immediately.
              <br />
              Once you have completed the test, carefully review your answers
              before submitting.
              <br />
              Click on the "Submit" button only when you are ready to finalize
              your test.
              <br />
              After submission, you may not be able to make any changes or
              revisit the test.
              <br /> If you have any questions or encounter any issues, reach
              out to your instructor immediately.
            </p>
            <h1>Good luck! </h1>
          </div>
          <label>
            <input
              type='checkbox'
              checked={agreed}
              onChange={handleAgreeChange}
              style={{marginRight:'8px'}}
            />
            I agree to the test instructions
          </label>
          <button
            className='btn btn-primary my-3 m-3'
            onClick={handleStartTest}
            disabled={!agreed}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;