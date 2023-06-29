// AdminLogin component is about admin page with different components like dashboard, assessments, test report and sign out
// import all required packages like react, react-icons, reactjs-popup, js-cookie, uuid, gapi-script, react-router-dom and AdminLogin.css, reactjs-popup/dist/index.css files to render AdminLogin component
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
// scopes variable is a google api to get access of google spreadsheets
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

const AdminLogin = () => {
  // usestates to store data responses for all tests
  const [streamData, setStreamData] = useState([]);
  // usestate to store user email of client
  const [userEmail, setUserEmail] = useState("");
  // usestate to store boolean value of signedIn status of client
  const [isSignedIn, setIsSignedIn] = useState(false);
  // navigate varaible used to navigating to different paths
  const navigate = useNavigate();

  useEffect(() => {
    //  after component rendering the below logic will execute
    // creates script element and appends to html head
    const loadGoogleAPI = () => {
      const script = document.createElement("script");
      script.src = process.env.REACT_APP_SCRIPT_SRC;
      script.onload = initializeGoogleAPI;
      document.head.appendChild(script);
    };

    // to initialize the google api
    const initializeGoogleAPI = () => {
      window.gapi.load("client:auth2", initClient);
    };

    // to initialize the google api client using apikey, client id, scopes and discoveryDocs from google cloud console
    const initClient = () => {
      window.gapi.client
        .init({
          // REACT_APP_API_KEY variable is google api key taken from .env file
          apiKey: process.env.REACT_APP_API_KEY,
          // REACT_APP_CLIENT_ID variable is google client id taken from .env file
          clientId: process.env.REACT_APP_CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4",
          ],
        })
        .then(() => {
          console.log("Google API client initialized");
          // auth instance variable used to get signed in
          const authInstance = window.gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(updateSignInStatus);
          // execute request function to get google sheet data responses of stream recommendation test
          executeRequestStreamRecommendationTest()
          getUserEmail();
        })
        // throws error if any error occurs while initializing google api client
        .catch((error) => {
          console.error("Error initializing Google API client", error);
        });
    };

    // update signin status function
    const updateSignInStatus = (isUserSignedIn) => {
      setIsSignedIn(isUserSignedIn);
      // if user is signedIn, getUserEmail function will render, otherwise userEmail variable will be set to empty
      if (isUserSignedIn) {
        getUserEmail();
      } else {
        setUserEmail("");
      }
    };

    const executeRequestStreamRecommendationTest=()=>{
      if (isSignedIn) return; // Don't execute if user is not signed in
      window.gapi.client.sheets.spreadsheets.values
        .get({
          // REACT_APP_GOOGLE_SHEET_ID variable is a google sheet id taken from .env file
          spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
          // REACT_APP_GOOGLE_SHEET_NAME variable is a google sheet name taken from .env file
          range: process.env.REACT_APP_GOOGLE_SHEET_NAME,
        })
        .then((response) => {
          const values = response.result.values || [];
          // headers variable refers to row that consists of column names of respones
          const headers = values[0];
          // jsonData refers to array of data responses from the google spreadsheet
          const jsonData = values.slice(1).map((row) => {
            const item = {};
            row.forEach((value, index) => {
              item[headers[index]] = value;
            });
            return item;
          });
          // storing stream recommendation test responses data in setStreamData function
          setStreamData(jsonData);
        })
        // throws error if any error occurs while executing request to get data
        .catch((error) => {
          console.error("Error executing request", error);
        });
    }

    // getUserEmail function
    const getUserEmail = () => {
      // authInstance varaiable to get authorization instance of admin
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        const currentUser = authInstance.currentUser.get();
        const basicProfile = currentUser.getBasicProfile();
        const email = basicProfile.getEmail();
        // if email from the auth instance equals to the provided email then a unique loginid token will be created
        if (email === "overseaseducation1000@gmail.com") {
          const loginId = uuidv4();
          // Cookies.set method is used to set cookies for the login id token and expiration validity of 30 days
          Cookies.set("token", loginId, { expires: 30 });
          // if email does not exists, notFound component will render
        } else {
          navigate("/notFound");
        }
        // userEmail value is set to the email
        setUserEmail(email);
      }
    };

    loadGoogleAPI();
  }, []);

  // fetchStreamTabulationData function used to calculate all streams scores of stream recommendation test and will be added to streamData responses
  const fetchStreamTabulationData=()=>{
    // map method for streamData 
    streamData.map((item,index)=>{
      // REACT_APP_HUMANITIES_APTITUDE_QUESTIONS_ANSWERS variable is an object taken from .env file
      let humanities_aptitude_responses=JSON.parse(process.env.REACT_APP_HUMANITIES_APTITUDE_QUESTIONS_ANSWERS)
      // REACT_APP_HUMANITIES_INTERESTS_QUESTIONS_ANSWERS variable is an object taken from .env file
      let humanities_interests_responses=JSON.parse(process.env.REACT_APP_HUMANITIES_INTERESTS_QUESTIONS_ANSWERS)
      //REACT_APP_COMMERCE_APTITUDE_QUESTIONS_ANSWERS) variable is an object taken from .env file
      let commerce_aptitude_reponses=JSON.parse(process.env.REACT_APP_COMMERCE_APTITUDE_QUESTIONS_ANSWERS)
      // REACT_APP_COMMERCE_INTERESTS_QUESTIONS_ANSWERS variable is an object taken from .env file
      let commerce_interests_responses=JSON.parse(process.env.REACT_APP_COMMERCE_INTERESTS_QUESTIONS_ANSWERS)
      // REACT_APP_SCIENCE_BIO_APTITUDE_QUESTIONS_ANSWERS variable is an object taken from .env file
      let science_bio_aptitude_responses=JSON.parse(process.env.REACT_APP_SCIENCE_BIO_APTITUDE_QUESTIONS_ANSWERS)
      // REACT_APP_SCIENCE_BIO_INTERESTS_QUESTIONS_ANSWERS variable is an object taken from .env file
      let science_bio_interests_responses=JSON.parse(process.env.REACT_APP_SCIENCE_BIO_INTERESTS_QUESTIONS_ANSWERS)
      // REACT_APP_SCIENCE_MATHS_APTITUDE_QUESTIONS_ANSWERS variable is an object taken from .env file
      let science_math_aptitude_responses=JSON.parse(process.env.REACT_APP_SCIENCE_MATHS_APTITUDE_QUESTIONS_ANSWERS)
      // REACT_APP_SCIENCE_MATHS_INTERESTS_QUESTIONS_ANSWERS variable is an object taken from .env file
      let science_math_interests_responses=JSON.parse(process.env.REACT_APP_SCIENCE_MATHS_INTERESTS_QUESTIONS_ANSWERS)
      // all streams aptitude and interests score initialized to zero
      let humanities_aptitude_score=0
      let humanities_interests_score=0
      let commerce_aptitude_score=0
      let commerce_interests_score=0
      let science_bio_aptitude_score=0
      let science_bio_interests_score=0
      let science_math_aptitude_score=0
      let science_math_interests_score=0
      // using map method for keys of object in stream Data to calculate scores
      Object.keys(item).map((score,i)=>{
        if (i>9 && i<90){
          // if index is in range of 10-90 then the below if condition executes
          if ((i-9) in humanities_aptitude_responses){
            // if index exists in humanities_aptitude_responses object then the below if condition executes
            if (item[score]===humanities_aptitude_responses[i-9]){
              // if the value that is stored in item equals to key that is in humanities_aptitude_responses object then the below if condition executes and caculates humanities_aptitude_score
              humanities_aptitude_score+=1
            }
          }
          else if ((i-9) in commerce_aptitude_reponses){
            // if index exists in commerce_aptitude_reponses object then the below if condition executes
            if (item[score]===commerce_aptitude_reponses[i-9]){
              // if the value that is stored in item equals to key that is in commerce_aptitude_reponses object then the below if condition executes and caculates commerce_aptitude_score
              commerce_aptitude_score+=1
            }
          }
          else if ((i-9) in science_bio_aptitude_responses){
            // if index exists in science_bio_aptitude_responses object then the below if condition executes
            if (item[score]===science_bio_aptitude_responses[i-9]){
              // if the value that is stored in item equals to key that is in science_bio_aptitude_responses object then the below if condition executes and caculates science_bio_aptitude_score
              science_bio_aptitude_score+=1
            }
          }
          else if ((i-9) in science_math_aptitude_responses){
            // if index exists in science_math_aptitude_responses object then the below if condition executes
            if (item[score]===science_math_aptitude_responses[i-9]){
              // if the value that is stored in item equals to key that is in science_math_aptitude_responses object then the below if condition executes and caculates science_math_aptitude_score
              science_math_aptitude_score+=1
            }
          }
          else if ((i-9) in humanities_interests_responses){
            // if index exists in humanities_interests_responses object then the below if condition executes
            if (item[score]===humanities_interests_responses[i-9]){
              // if the value that is stored in item equals to key that is in humanities_interests_responses object then the below if condition executes and caculates humanities_interests_score
              humanities_interests_score+=1
            }
          }
          else if ((i-9) in commerce_interests_responses){
            // if index exists in commerce_interests_responses object then the below if condition executes
            if (item[score]===commerce_interests_responses[i-9]){
              // if the value that is stored in item equals to key that is in commerce_interests_responses object then the below if condition executes and caculates commerce_interests_score
              commerce_interests_score+=1
            }
          }
          else if ((i-9) in science_bio_interests_responses){
            // if index exists in science_bio_interests_responses object then the below if condition executes
            if (item[score]===science_bio_interests_responses[i-9]){
              // if the value that is stored in item equals to key that is in science_bio_interests_responses object then the below if condition executes and caculates science_bio_interests_score
              science_bio_interests_score+=1
            }
          }
          else if ((i-9) in science_math_interests_responses){
            // if index exists in science_math_interests_responses object then the below if condition executes
            if (item[score]===science_math_interests_responses[i-9]){
              // if the value that is stored in item equals to key that is in science_math_interests_responses object then the below if condition executes and caculates science_math_interests_score
              science_math_interests_score+=1
            }
          }
        }
      })
      let total_score=humanities_aptitude_score+commerce_aptitude_score+science_bio_aptitude_score+science_math_aptitude_score+
      humanities_interests_score+commerce_interests_score+science_bio_interests_score+science_math_interests_score
      item.humanities_aptitude_score=humanities_aptitude_score
      item.humanities_interests_score=humanities_interests_score
      item.commerce_aptitude_score=commerce_aptitude_score
      item.commerce_interests_score=commerce_interests_score
      item.science_bio_aptitude_score=science_bio_aptitude_score
      item.science_bio_interests_score=science_bio_interests_score
      item.science_math_aptitude_score=science_math_aptitude_score
      item.science_math_interests_score=science_math_interests_score
      item.humanities_score=humanities_aptitude_score+humanities_interests_score
      item.commerce_score=commerce_aptitude_score+commerce_interests_score
      item.science_bio_score=science_bio_aptitude_score+science_bio_interests_score
      item.science_math_score=science_math_aptitude_score+science_math_interests_score
      item.total_score=total_score
    })
  }

  // after component rendering, fetchStreamTabulationData function logic will execute
  useEffect(()=>{
    fetchStreamTabulationData()
    // streamData dependency is used so that any changes in streamData variable occurs, this effect will rerun
  },[streamData])


  // handleSignIn function to handle different errors during sign in
  const handleSignIn = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signIn().catch((error) => {
      if (error.error === "popup_closed_by_user") {
        console.error("Popup Closed By the User", error);
      } else {
        console.error("Error signing in with Google", error);
        // Handle other sign-in errors
      }
    });
  };

  // handleSignOut function used to signout of admin google account
  const handleSignOut = () => {
    Cookies.remove("token");
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signOut();
  };


  return (
    <div>
      <div>
        <p>
          {isSignedIn ? (
            // if admin has signedIn, the below code will render
            <div className='admin-header-container'>
              {/* header for desktop  with Logo and components Dashboard, Assessments, Test Reports, Student Reports and Sign Out */}
              <div className='admin-header-logo-container'>
                {/* logo and after clicking this logo, it'll navigates to home route*/}
                <img
                  src='https://res.cloudinary.com/dufx8zalt/image/upload/v1687419355/logoimage1_krvkbq.png'
                  alt='logo'
                  style={{
                    height: "50px",
                    width: "100px",
                    borderRadius: "10px",
                  }}
                  onClick={() => navigate("/")}
                />
              </div>
              <div className='admin-desktop-header-navbar-container'>
                {/* when clicking this Dashboard text, it'll navigates to dashboard route */}
                <p
                  onClick={() => navigate("/dashboard", { state: streamData })}
                  className='admin-desktop-header-navbar-link'
                >
                  Dashboard
                </p>
                {/* when clicking this Assessments text, it'll navigates to send assessments route */}
                <p
                  onClick={() =>
                    navigate("/sendAssessments", { state: streamData })
                  }
                  className='admin-desktop-header-navbar-link'
                >
                  Assessments
                </p>
                {/* when clicking this Test Report text, it'll navigates to test report route */}
                <p
                  onClick={() => navigate("/testReport", { state: streamData})}
                  className='admin-desktop-header-navbar-link'
                >
                  Test Report
                </p>
                {/* when clicking this Sign Out text, it'll navigates to admin login route and agains admin needs to sign in to access all routes */}
                <p
                  className='admin-desktop-header-navbar-link'
                  onClick={handleSignOut}
                >
                  Sign Out
                </p>
              </div>
              {/* nav header for mobile  with Logo and components Dashboard, Assessments, Test Report and Sign Out */}
              <div className='admin-mobile-header-navbar-container'>
                <Popup
                  contentStyle={{ textAlign:'center',display:'flex',justifyContent:'center',width: "100%", backgroundColor: "white" }}
                  trigger={
                    <button className='admin-hamburger-btn'>
                      <GiHamburgerMenu />
                    </button>
                  }
                  position='bottom right'
                >
                  <ul className='admin-mobile-hamburger-menu'>
                    {/* when clicking this Dashboard text, it'll navigates to dashboard route */}
                    <li
                      onClick={() =>
                        navigate("/dashboard", { state: streamData})
                      }
                      className='admin-header-navbar-link'
                    >
                      Dashboard
                    </li>
                    {/* when clicking this Assessments text, it'll navigates to send assessments route */}
                    <li
                      onClick={() =>
                        navigate("/sendAssessments", { state: streamData })
                      }
                      className='admin-header-navbar-link'
                    >
                      Assessments
                    </li>
                    {/* when clicking this Test Report text, it'll navigates to test report route */}
                    <li
                      onClick={() =>
                        navigate("/testReport", { state: streamData})
                      }
                      className='admin-header-navbar-link'
                    >
                      Test Report
                    </li>
                    {/* when clicking this Sign Out text, it'll navigates to admin login route and agains admin needs to sign in to access all routes */}
                    <li
                      onClick={handleSignOut}
                      className='admin-header-navbar-link'
                    >
                      Sign Out
                    </li>
                  </ul>
                </Popup>
              </div>
            </div>
          ) : (
            // if admin hasn't signedIn, the below code will render
            <div className='display-column'>
              <h2>Login With Google</h2>
              {/* if admin clicks this button, he can sign in into his account and get access for all routes */}
              <button onClick={handleSignIn} className='google-signin-button'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
                  alt='Google Logo'
                />
                Sign In with Google
              </button>
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;