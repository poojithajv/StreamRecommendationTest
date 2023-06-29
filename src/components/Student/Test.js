// Test Component used to get the google form to take the test
import React from "react";
import './index.css'

const PsychoMetricText = () => {
  return (
    <div>
      <div className='details-container'>
        <div>
          <div>
            <iframe
              src='https://docs.google.com/forms/d/e/1FAIpQLSc6Awak0_3NAajQr7wKL2Rs_Uchp6wbmzQSmeiobQHPoe0idg/viewform?embedded=true'
              width='1000'
              height='5154'
            >
              Loading…
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychoMetricText;