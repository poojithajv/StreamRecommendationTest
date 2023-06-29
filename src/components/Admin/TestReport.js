// Test Report component is about displaying all students data respones of stream recommendation test in table
// import react, react-router-dom, react-icons, js-cookie packages and reactjs-popup/dist/index.css and index.css files to render TestReport component
import { useState,useEffect} from "react"
import { GiHamburgerMenu } from "react-icons/gi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Cookies from "js-cookie";
import {useNavigate,useLocation} from 'react-router-dom'
import './index.css'

function TestReport() {
  // location varaiable to get location of the testReport route and state
  const location=useLocation()
  // useState of data to store stream recommendation test data responses 
  const [data,setData]=useState(location.state)
  console.log(data)
  // navigate variable used to naviagating to different routes
  const navigate=useNavigate()
  // usestate of search to store search data 
  const [search,setSearch]=useState('')
  // filterData usestate to store filtered data
  const [filterData, setFilterData] = useState(data)
  // startDate usestate to store start date
  const [startDate, setStartDate] = useState("");
  // startDate usestate to store start date
  const [endDate, setEndDate] = useState("");

  // handleSearch function to set the search value to setSearch function
  const handleSearch=(e)=>{
    setSearch(e.target.value)
}

// handleFilter function used to filter the all tests data responses using start date and end date
const handleFilter = () => {  
  const filtered = data.filter((item) => {
    const [date,month,year]=item.Timestamp.split(' ')[0].split('/')
    const timestamp=new Date(`${month}/${date}/${year} ${item.Timestamp.split(' ')[1]}`)
    const itemDate = new Date(timestamp)
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1); // Added one day to the end date
    return itemDate >= start && itemDate <= end;
  });
  // set filter data array to setFilterData function
  setFilterData(filtered);
};

 // filteredData variable used to store all filtered tests data reponses by email id search
 const filteredData=filterData.filter(i=>i.Email_Address.toLowerCase().includes(search.toLowerCase()))


  // handleUpdate function to update all streams scores to google sheet of stream recommendation Test google sheet using sheet db google api
  const handleUpdate=(item)=>{
      if (item.Total_Score===undefined){
        // if Total_Score column is not present in google sheet, the below code will execute
        // fetching an sheet db api to access the required data in google sheet
          fetch(`https://sheetdb.io/api/v1/bhymdl2yiryk4/Email_Address/${item.Email_Address}`,{
              method: "PATCH",
              headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer q031lh4xf0lyhtpa9mk47wiyqyaitt6xowfd8zp3",
              },
              // in body we need to add all the required data to update it in google sheet
              body: JSON.stringify({
                  data: {
                    Humanities_Score: item.humanities_score,
                    Commerce_Score: item.commerce_score,
                    Science_With_Bio_Score:item.science_bio_score,
                    Science_With_Math_Score:item.science_math_score,
                    Aptitude_Score:item.humanities_aptitude_score+item.commerce_aptitude_score+item.science_bio_aptitude_score+item.science_math_aptitude_score,
                    Interests_Score:item.humanities_interests_score+item.commerce_interests_score+item.science_bio_interests_score+item.science_math_interests_score,
                    Total_Score:item.total_score
                  },
                }),
          })
          .then((response) => response.json())
          .then((data) => console.log(data));
      }
    }

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
    <>
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
    {/* table container with search, filter by date and table data */}
    <div className='test-reports-container'>
        <h1 style={{textAlign:'center',marginBottom:'20px'}}>Stream Recommendation Test Tabulation Data</h1>
        {/* search input container */}
        <div className='input-label-container'>
          <label htmlFor="search">
                Search by Student Email : 
          </label>
          <input id="search" value={search} type="text" onChange={handleSearch} style={{marginBottom:'20px',marginLeft:'25px'}} className='input-search'/>
        </div>
        {/* filter with start date, end date and filter button */}
        <div className='date-filter'>
          <div className='display-between'>
            Start Date:{"   "}
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{marginLeft:'10px'}}
            />
          </div>
          <div className='display-between'>
            End Date:{" "}
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{marginLeft:'10px'}}
            />
          </div>
          <button style={{padding:'2px',width:'60px'}} onClick={handleFilter}>Filter</button>
        </div>
      
      {/* desktop table container with table of stream recommendation test data respones */}
      <div className="test-table">
        {filteredData.length> 0 ? <table border="2px" style={{margin:'auto'}}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Completed On</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Parent Email Id</th>
                    <th>Parent Phone Number</th>
                    <th>Total Score</th>
                    <th>Humanities Score</th>
                    <th>Commerce Score</th> 
                    <th>Science With Bio Score</th>
                    <th>Science With Math Score</th>
                    <th>View Score</th>
                    <th>View Data</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item,index) =><tr>
                    <td>{index+1}</td>
                    <td>{item.Timestamp}</td>
                    <td>{item.Full_Name}</td>
                    <td>{item.Email_Address}</td>
                    <td>{item.Phone_Number}</td>
                    <td>{item.Parent_Email_Id}</td>
                    <td>{item.Parent_Phone_Number}</td>
                    <td>{item.Score}</td>
                    <td>{item.humanities_score}</td>
                    <td>{item.commerce_score}</td>
                    <td>{item.science_bio_score}</td>
                    <td>{item.science_math_score}</td>
                    <td>
                      {/* clicking view Score button it'll navigates to studentChart route */}
                        <button onClick={()=>{navigate('/studentChart',{state:item})
                        handleUpdate(item)}} style={{padding:'3px',width:'80px',height:'40px',fontSize:'12px',backgroundColor:'lightblue',fontWeight:'bold'}}>
                            View Score
                        </button>
                    </td>
                    <td>
                      {/* clicking view Data button it'll navigates to studentBarChart route */}
                        <button onClick={()=>navigate('/studentBarChart',{state:item})
                        } style={{padding:'3px',width:'80px',height:'40px',fontSize:'12px',backgroundColor:'lightgrey',fontWeight:'bold'}}>
                            View Data
                        </button>
                    </td>
                </tr>)}
            </tbody>
        </table> :"No Data Found"}
        </div>
        {/* mobile table container with table of stream recommendation test data responses */}
        <div className='mobile-table'>
          {filteredData.length >0  ? (
            filteredData.map((item,index)=>
             <div className='table-data-container'>
                <div className='table-data'>
                  <p className='th'>Id</p>
                  <p className='td'>{index+1}</p>
                </div>
                <div className='table-data'>
                  <p>Completed On</p>
                  <p className='td'>{item.Timestamp}</p>
                </div>
                <div className='table-data'>
                  <p>Full Name</p>
                  <p className='td'>{item.Full_Name}</p>
                </div>
                <div className='table-data'>
                  <p>Email Address</p>
                  <p className='td'>{item.Email_Address}</p>
                </div>
                <div className='table-data'>
                  <p>Phone Number</p>
                  <p className='td'>{item.Phone_Number}</p>
                </div>
                <div className='table-data'>
                  <p>Parent Email Id</p>
                  <p className='td'>{item.Parent_Email_Id}</p>
                </div>
                <div className='table-data'>
                  <p>Parent Phone Number</p>
                  <p className='td'>{item.Parent_Phone_Number}</p>
                </div>
                <div className='table-data'>
                  <p>Total Score</p>
                  <p className='td'>{item.Score}</p>
                </div>
                <div className='table-data'>
                  <p>Humanities Score</p>
                  <p className='td'>{item.humanities_score}</p>
                </div>
                <div className='table-data'>
                  <p>Commerce Score</p>
                  <p className='td'>{item.commerce_score}</p>
                </div>
                <div className='table-data'>
                  <p>Science With Bio Score</p>
                  <p className='td'>{item.science_bio_score}</p>
                </div>
                <div className='table-data'>
                  <p>Science With Math Score</p>
                  <p className='td'>{item.science_math_score}</p>
                </div>
                {/* clicking view Score button it'll navigates to studentChart route */}
                <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                <div style={{textAlign:'center',marginRight:'20px'}}>
                  <button className='view-button' onClick={()=>{navigate('/studentChart',{state:item})
                  handleUpdate(item)}}>View Score</button>
                </div>
                {/* clicking view Data button it'll navigates to studentBarChart route */}
                <div style={{textAlign:'center'}}>
                  <button style={{backgroundColor:'lightgrey'}} className='view-button' onClick={()=>navigate('/studentBarChart',{state:item})}>View Data</button>
                </div>
                </div>
              </div>
            ) ) : 'No Data Found'}
        </div>
    </div>
    </>
  )
}

export default TestReport