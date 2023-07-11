// Dashboard component about displaying all streams metrics of stream recommendation test
// import packages like react, react-router-dom, react-google-charts, gapi-script, js-cookie, and css files like reactjs-popup/dist/index.css, index.css files to render dashboard component
import React, { useEffect,useState } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { Chart } from "react-google-charts";
import gapi from 'gapi-script'
import Cookies from "js-cookie";
import 'reactjs-popup/dist/index.css';
import './index.css'

function Dashboard(props) {
  // location varaiable to get location of the dashboard route and state
  const {datat}=props
  const location=useLocation()
  // navigate variable used to naviagating to different routes
  const navigate = useNavigate();
  // useState of data to store the stream recommendation test data responses
  const [data,setData]=useState(datat)
  // filterData usestate to store filter data
  const [filterData, setFilterData] = useState(data);
  // startDate usestate to store start date
  const [startDate, setStartDate] = useState("");
  // endDate usestate to store the end date
  const [endDate, setEndDate] = useState("");
    // handleFilter function used to filter the all tests data responses using start date and end date
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const [date, month, year] = item.Timestamp.split(" ")[0].split("/");
      const timestamp = new Date(
        `${month}/${date}/${year} ${item.Timestamp.split(" ")[1]}`
      );
      const itemDate = new Date(timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Added one day to the end date
      return itemDate >= start && itemDate <= end;
    });
    // set filter data array to setFilterData function
    setFilterData(filtered);
  };

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
  filterData.map((item,index)=>{
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
  humanities_percentage=humanities_total_score/(filterData.length*(parseInt(process.env.REACT_APP_HUMANITIES_APTITIUDE_QUESTIONS)+parseInt(process.env.REACT_APP_HUMANITIES_INTERESTS_QUESTIONS)))*100
  commerce_percentage=commerce_total_score/(filterData.length*(parseInt(process.env.REACT_APP_COMMERCE_APTITUDE_QUESTIONS)+parseInt(process.env.REACT_APP_COMMERCE_INTERESTS_QUESTIONS)))*100
  science_with_bio_percentage=science_with_bio_total_score/(filterData.length*(parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_APTITUDE_QUESTIONS)+parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_INTERESTS_QUESTIONS)))*100
  science_with_math_percentage=science_with_maths_total_score/(filterData.length*(parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_APTITUDE_QUESTIONS)+parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_INTERESTS_QUESTIONS)))*100

  // all streams aptitude total scores percentages of all students
  humanities_aptitude_percentage=humanities_aptitude_total_score/(filterData.length*parseInt(process.env.REACT_APP_HUMANITIES_APTITIUDE_QUESTIONS))*100
  commerce_aptitude_percentage=commerce_aptitude_total_score/(filterData.length*parseInt(process.env.REACT_APP_COMMERCE_APTITUDE_QUESTIONS))*100
  science_with_bio_aptitude_percentage=science_with_bio_aptitude_total_score/(filterData.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_APTITUDE_QUESTIONS))*100
  science_with_math_aptitude_percentage=science_with_maths_aptitude_total_score/(filterData.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_APTITUDE_QUESTIONS))*100

  // all streams interst total scores percentages of all students
  humanities_interest_percentage=humanities_interest_total_score/(filterData.length*parseInt(process.env.REACT_APP_HUMANITIES_INTERESTS_QUESTIONS))*100
  commerce_interest_percentage=commerce_interest_total_score/(filterData.length*parseInt(process.env.REACT_APP_COMMERCE_INTERESTS_QUESTIONS))*100
  science_with_bio_interest_percentage=science_with_bio_interest_total_score/(filterData.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_BIO_INTERESTS_QUESTIONS))*100
  science_with_math_interest_percentage=science_with_maths_interest_total_score/(filterData.length*parseInt(process.env.REACT_APP_SCIENCE_WITH_MATH_INTERESTS_QUESTIONS))*100

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
        {/* dashboard container where all metrics were displayed */}
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Stream Recommendation Test metrics</h1>
            {/* date filter */}
            <div className='date-filter'>
                <div className='display-between'>
                    Start Date:{"   "}
                    <input
                    type='date'
                    value={startDate}
                    className='date-input'
                    style={{marginLeft:'10px'}}
                    max = {new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className='display-between'>
                    End Date:{" "}
                    <input
                    type='date'
                    value={endDate}
                    className='date-input'
                    style={{marginLeft:'10px'}}
                    max = {new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button
                    style={{ padding: "3px", width: "60px",backgroundColor:"#004461",color:'#FFFFFF',border:'none',borderRadius:'5px' }}
                    onClick={handleFilter}
                >
                    Filter
                </button>
            </div>
            {/* if filterData length if greater than zero then below code will execute */}
            {filterData.length ? (
            <h2 className="allmetricsHeading">Below Metrics are about percentage of each stream which are correctly answered by students</h2> )
            :null}
            <div style={{ textAlign: "center" }}>
                <button className="totaltestconductedbutton">
                    Total Tests Conducted: {filterData.length}
                </button>
            </div>
            {/* all streams pie charts */}
            <div className="test-chart">
                {/* all streams total scores percentages pie chart */}
                {filterData.length ? (
                <div className="piechart-container">
                    <Chart width={250} height={250}
                    className="allstreamsPiechart"
                    chartType="PieChart"
                    data={pieData}
                    options={{
                    colors:["#0e3ab3","#f05232","#e89510","#2b8a3c"],
                    title:`All Streams Total Metric: ${filterData.length===1 ? '1 test' : `${filterData.length} tests`}`,legend:"none"
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
                ) : null}
                {/* all streams aptitude total scores percentages pie chart */}
                {filterData.length ? (
                <div className="piechart-container">
                <Chart width={250} height={250}
                    className="allstreamsPiechart"
                    chartType="PieChart"
                    data={pieData1}
                    options={{
                    colors:["#963596","#5c9ed1","#e62e81","#62b027"],
                    title:`All Streams Aptitude Metric: ${filterData.length===1 ? '1 test' : `${filterData.length} tests`}`,legend:"none"
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
                ) : null}
                {/* all streams interest total scores percentages pie chart */}
                {filterData.length? (
                <div className="piechart-container">
                <Chart width={250} height={250}
                    className="allstreamsPiechart"
                    chartType="PieChart"
                    data={pieData2}
                    options={{
                    colors:["#b02709","#102061","#630fa8","#88e615"],
                    title:`All Streams Interest Metric: ${filterData.length===1 ? '1 test' : `${filterData.length} tests`}`,legend:"none"
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
                ) : null}
            </div>
        </div>
    </div>
  )
}

export default Dashboard