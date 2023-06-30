// Dashboard component about displaying all streams metrics of stream recommendation test
// import packages like react, react-router-dom, react-google-charts, gapi-script, js-cookie, react-icons, reactjs-popup and css files like reactjs-popup/dist/index.css, index.css files to render dashboard component
import React, { useEffect,useState } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { Chart } from "react-google-charts";
import gapi from 'gapi-script'
import Cookies from "js-cookie";
import {GiHamburgerMenu} from "react-icons/gi"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './index.css'

function Dashboard() {
  // location varaiable to get location of the dashboard route and state
  const location=useLocation()
  // navigate variable used to naviagating to different routes
  const navigate = useNavigate();
  // useState of data to store the stream recommendation test data responses
  const [data,setData]=useState(location.state)

  // initializing all streams aptitude, interest, total scores and percentages to zero
  let humanities_total_score=0,humanities_aptitude_total_score=0,humanities_interest_total_score=0
  let commerce_total_score=0,commerce_aptitude_total_score=0,commerce_interest_total_score=0
  let science_with_bio_total_score=0,science_with_bio_aptitude_total_score=0,science_with_bio_interest_total_score=0
  let science_with_maths_total_score=0,science_with_maths_aptitude_total_score=0,science_with_maths_interest_total_score=0
  let humanities_percentage=0,humanities_aptitude_percentage=0,humanities_interest_percentage=0
  let commerce_percentage=0,commerce_aptitude_percentage=0,commerce_interest_percentage=0
  let science_with_bio_percentage=0,science_with_bio_aptitude_percentage=0,science_with_bio_interest_percentage=0
  let science_with_math_percentage=0,science_with_math_aptitude_percentage=0,science_with_math_interest_percentage=0
  // using map method for data to calculate different streams scores of all students
  data.map((item,index)=>{
    // all streams total scores of all students
    humanities_total_score+=item.humanities_score
    commerce_total_score+=item.commerce_score
    science_with_bio_total_score+=item.science_bio_score
    science_with_maths_total_score+=item.science_math_score

    // all streams aptitude total scores of all students
    humanities_aptitude_total_score+=item.humanities_aptitude_score
    commerce_aptitude_total_score+=item.commerce_aptitude_score
    science_with_bio_aptitude_total_score+=item.science_bio_aptitude_score
    science_with_maths_aptitude_total_score+=item.science_math_aptitude_score

    // all streams interest total scores of all students
    humanities_interest_total_score+=item.humanities_interests_score
    commerce_interest_total_score+=item.commerce_interests_score
    science_with_bio_interest_total_score+=item.science_bio_interests_score
    science_with_maths_interest_total_score+=item.science_math_interests_score
  })
  // all streams total scores percentages of all students
  humanities_percentage=humanities_total_score/(data.length*(parseInt(process.env.REACT_APP_HUMANITIES_APTITIUDE_QUESTIONS)+parseInt(process.env.REACT_APP_HUMANITIES_INTERESTS_QUESTIONS)))*100
  commerce_percentage=commerce_total_score/(data.length*(parseInt(process.env.REACT_APP_COMMERCE_APTITUDE_QUESTIONS)+parseInt(process.env.REACT_APP_COMMERCE_INTERESTS_QUESTIONS)))*100
  science_with_bio_percentage=science_with_bio_total_score/(data.length*(parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_APTITUDE_QUESTIONS)+parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_INTERESTS_QUESTIONS)))*100
  science_with_math_percentage=science_with_maths_total_score/(data.length*(parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_APTITUDE_QUESTIONS)+parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_INTERESTS_QUESTIONS)))*100

  // all streams aptitude total scores percentages of all students
  humanities_aptitude_percentage=humanities_aptitude_total_score/(data.length*parseInt(process.env.REACT_APP_HUMANITIES_APTITIUDE_QUESTIONS))*100
  commerce_aptitude_percentage=commerce_aptitude_total_score/(data.length*parseInt(process.env.REACT_APP_COMMERCE_APTITUDE_QUESTIONS))*100
  science_with_bio_aptitude_percentage=science_with_bio_aptitude_total_score/(data.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_APTITUDE_QUESTIONS))*100
  science_with_math_aptitude_percentage=science_with_maths_aptitude_total_score/(data.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_APTITUDE_QUESTIONS))*100

  // all streams interst total scores percentages of all students
  humanities_interest_percentage=humanities_interest_total_score/(data.length*parseInt(process.env.REACT_APP_HUMANITIES_INTERESTS_QUESTIONS))*100
  commerce_interest_percentage=commerce_interest_total_score/(data.length*parseInt(process.env.REACT_APP_COMMERCE_INTERESTS_QUESTIONS))*100
  science_with_bio_interest_percentage=science_with_bio_interest_total_score/(data.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_INTERESTS_QUESTIONS))*100
  science_with_math_interest_percentage=science_with_maths_interest_total_score/(data.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_INTERESTS_QUESTIONS))*100

   // pie Data of all streams total scores percentages of stream recommendation test
  const pieData=[
    ["Language", "Speakers (in millions)"],
    ['Humanities',humanities_percentage],
    ['Commerce',commerce_percentage],
    ['Science (Bio)',science_with_bio_percentage],
    ['Science (Math)',science_with_math_percentage]
  ]
  // pie Data of all streams aptitude total scores percentages of stream recommendation test
  const pieData1=[
    ["Language", "Speakers (in millions)"],
    ['Humanities Aptitude',humanities_aptitude_percentage],
    ['Commerce Aptitude',commerce_aptitude_percentage],
    ['Science (Bio) Aptitude',science_with_bio_aptitude_percentage],
    ['Science (Math) Aptitude',science_with_math_aptitude_percentage]
  ]
  // pie Data of all streams interest total scores percentages of stream recommendation test
  const pieData2=[
    ["Language", "Speakers (in millions)"],
    ['Humanities Interest',humanities_interest_percentage],
    ['Commerce Interest',commerce_interest_percentage],
    ['Science (Bio) Interest',science_with_bio_interest_percentage],
    ['Science (Math) Interest',science_with_math_interest_percentage]
  ]

  // after component rendering, the below effect will run only once with empty depenpency array
  useEffect(() => {
    // token varaible to get token value
    const token = Cookies.get("token");
    if (!token) {
      // if token is undefined, notFound Component will be navigated
      navigate("/notFound");
    }
  }, []);
  return (
    <div className="main-container">
        {/* if admin has signedIn, the below code will render */}
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
            onClick={() => navigate("/dashboard", { state: data })}
            className='admin-desktop-header-navbar-link'
            >
            Dashboard
            </p>
            {/* when clicking this Assessments text, it'll navigates to send assessments route */}
            <p
            onClick={() =>
                navigate("/sendAssessments", { state: data })
            }
            className='admin-desktop-header-navbar-link'
            >
            Assessments
            </p>
            {/* when clicking this Test Report text, it'll navigates to test report route */}
            <p
            onClick={() => navigate("/testReport", { state: data})}
            className='admin-desktop-header-navbar-link'
            >
            Test Report
            </p>
            {/* when clicking this Admin text, it'll navigates to admin login route and agains admin can access all routes */}
            <p
            className='admin-desktop-header-navbar-link'
            onClick={()=>navigate('/adminLogin')}
            >
            Admin
            </p>
        </div>
        {/* nav header for mobile  with Logo and components Dashboard, Assessments, Test Report and Admin */}
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
                    navigate("/dashboard", { state: data})
                }
                className='admin-header-navbar-link'
                >
                Dashboard
                </li>
                {/* when clicking this Assessments text, it'll navigates to send assessments route */}
                <li
                onClick={() =>
                    navigate("/sendAssessments", { state: data })
                }
                className='admin-header-navbar-link'
                >
                Assessments
                </li>
                {/* when clicking this Test Report text, it'll navigates to test report route */}
                <li
                onClick={() =>
                    navigate("/testReport", { state: data})
                }
                className='admin-header-navbar-link'
                >
                Test Report
                </li>
                {/* when clicking this Admin text, it'll navigates to admin login route and agains admin can access all routes */}
                <li
                onClick={()=>navigate('/adminLogin')}
                className='admin-header-navbar-link'
                >
                Admin
                </li>
            </ul>
            </Popup>
        </div>
        </div>
        {/* dashboard container where all metrics were displayed */}
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Stream Recommendation Test metrics</h1>
            <h2 className="allmetricsHeading">Below Metrics are about percentage of each stream which are correctly answered by students</h2> 
            {/* all streams pie charts */}
            <div className="test-chart">
                {/* all streams total scores percentages pie chart */}
                <div className="piechart-container">
                <Chart
                className="allstreamsPiechart"
                chartType="PieChart"
                data={pieData}
                options={{
                colors:["#0e3ab3","#f05232","#e89510","#2b8a3c"],
                title:"Stream Recommendation Test Metric",legend:"none"
                }}
            ></Chart>
            <div className='legend-container'>
            <div className="test-legend">
                    <button className='color' ></button>
                    <span className='test'>Humanities</span>
                </div>
                <div className="test-legend">
                    <button style={{backgroundColor:"#f05232"}} className='color'></button>
                    <span className='test'>Commerce</span>
                </div>
                <div className="test-legend">
                    <button style={{backgroundColor:"#e89510"}} className='color'></button>
                    <span className='test'>Science (Bio)</span>
                </div>
                <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#2b8a3c"}}></button>
                    <span className='test'>Science (Math)</span>
                </div>
            </div>
            </div>
            {/* all streams aptitude total scores percentages pie chart */}
            <div className="piechart-container">
            <Chart
                className="allstreamsPiechart"
                chartType="PieChart"
                data={pieData1}
                options={{
                colors:["#963596","#5c9ed1","#e62e81","#62b027"],
                title:"All Streams Aptitude Metric",legend:"none"
                }}
            ></Chart>
            <div className="legend-container">
            <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#963596"}}></button>
                    <span className='test'>Humanities Aptitude</span>
                </div>
                <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#5c9ed1"}}></button>
                    <span className='test'>Commerce Aptitude</span>
                </div>
                <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#e62e81"}}></button>
                    <span className='test'>Science (Bio) Aptitude</span>
                </div>
                <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#62b027"}}></button> 
                    <span className='test'>Science (Math) Aptitude</span>
                </div>
            </div>
            </div>
            {/* all streams interest total scores percentages pie chart */}
            <div className="piechart-container">
            <Chart
                className="allstreamsPiechart"
                chartType="PieChart"
                data={pieData2}
                options={{
                colors:["#b02709","#102061","#630fa8","#88e615"],
                title:"All Streams Interest Metric",legend:"none"
                }}
            ></Chart>
            <div className="legend-container">
            <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#b02709"}}></button>   
                    <span className='test'>Humanities Interest</span>
                </div>
                <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#102061"}}></button>
                    <span className='test'>Commerce Interest</span>
                </div>
                <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#630fa8"}}></button>
                    <span className='test'>Science (Bio) Interest</span>
                </div>
                <div className="test-legend">
                    <button className='color' style={{backgroundColor:"#88e615"}}></button>
                    <span className='test'>Science (Math) Interest</span>
                </div>
            </div>
            </div>
            
            </div>
        </div>
    </div>
  )
}

export default Dashboard