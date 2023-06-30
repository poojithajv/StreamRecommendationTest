// Test Report component is about displaying all students data respones of stream recommendation test in table
// import react, react-router-dom, react-icons, js-cookie packages and reactjs-popup/dist/index.css and index.css files to render TestReport component
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./index.css";

function TestReport() {
  // location varaiable to get location of the testReport route and state
  const location = useLocation();
  // useState of data to store stream recommendation test data responses
  const [data, setData] = useState(
    (location.state || []).map((field, index) => ({
      ...field,
      id: index + 1, // Adding 1 to index to make IDs start from 1
    }))
  );
  console.log(data);
  // navigate variable used to naviagating to different routes
  const navigate = useNavigate();
  // usestate of search to store search data
  const [search, setSearch] = useState("");
  // filterData usestate to store filtered data
  const [filterData, setFilterData] = useState(data);
  // startDate usestate to store start date
  const [startDate, setStartDate] = useState("");
  // startDate usestate to store start date
  const [endDate, setEndDate] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 40,
      headerClassName: "table-header",
      cellClassName: "table-cell",
      sortable:false
    },
    {
      field: "Timestamp",
      headerName: "CompletedOn",
      width: 100,
      headerClassName: "table-header",
      cellClassName: "table-cell",
      sortable:false
    },
    {
      field: "Full_Name",
      headerName: "Name",
      width: 120,
      headerClassName: "table-header",
      cellClassName: "table-cell",
      renderCell: (params) => (
        <div style={{ whiteSpace: "wrap", lineHeight: "1" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "Email_Address",
      headerName: "Email Address",
      width: 160,
      headerClassName: "table-header",
      cellClassName: "table-cell",
      renderCell: (params) => (
        <div
          style={{
            width:'130px',
            wordWrap: "break-word",
            whiteSpace: "wrap",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "Phone_Number",
      headerName: "Phone Number",
      width: 120,
      headerClassName: "table-header",
      cellClassName: "table-cell",
      sortable:false
    },
    {
      field: "Parent_Email_Id",
      headerName: "Parent Email Id",
      width: 160,
      headerClassName: "table-header",
      cellClassName: "table-cell",
      renderCell: (params) => (
        <div style={{ whiteSpace: "wrap",
        wordWrap: "break-word",
        width:'130px' }}>{params.value}</div>
      ),
    },
    {
      field: "Parent_Phone_Number",
      headerName: "Parent Phone Number",
      width: 120,
      headerClassName: "table-header",
      cellClassName: "table-cell",
      sortable:false
    },
    {
      field: "Score",
      headerName: "Total Score",
      width: 100,
      headerClassName: "table-header",
      cellClassName: "table-cell",
    },
    {
      field: "humanities_score",
      headerName: "Humanities Score",
      width: 100,
      headerClassName: "table-header",
      cellClassName: "table-cell",
    },
    {
      field: "commerce_score",
      headerName: "Commerce Score",
      cellClassName: "table-cell",
      width: 100,
      headerClassName: "table-header",
    },
    {
      field: "science_bio_score",
      headerName: "Science With Bio Score",
      cellClassName: "table-cell",
      width: 100,
      headerClassName: "table-header",
      renderCell: (params) => (
        <div style={{ textAlign: "center", whiteSpace: "wrap" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "science_math_score",
      headerName: "Science With Math Score",
      cellClassName: "table-cell",
      width: 100,
      headerClassName: "table-header",
    },
    {
      field: "View Score",
      headerName: "View Score",
      cellClassName: "table-cell",
      width: 100,
      headerClassName: "table-header",
      sortable:false,
      renderCell: (params) => (
        <button
          onClick={() => {
            navigate("/studentChart", { state: params.row });
            handleUpdate(params.row);
          }}
          style={{
            padding: "3px",
            width: "70px",
            height: "30px",
            fontSize: "10px",
            backgroundColor: "lightblue",
            fontWeight: "bold",
            border:'none'
          }}
        >
          View Score
        </button>
      ),
    },
    {
      field: "View data",
      headerName: "View Data",
      width: 100,
      sortable:false,
      renderCell: (params) => (
        <button
          onClick={() => navigate("/studentBarChart", { state: params.row })}
          style={{
            padding: "3px",
            width: "70px",
            height: "30px",
            fontSize: "10px",
            backgroundColor: "lightgrey",
            fontWeight: "bold",
            border:'none'
          }}
        >
          View Data
        </button>
      ),
    },
  ];

  // handleSearch function to set the search value to setSearch function
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if ((e.target.value = "" || e.key === "Backspace" || e.keyCode === 8)) {
      setFilterData(data);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setSearch(e.target.value);
      setFilterData(data);
    }
  };

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

  // filteredData variable used to store all filtered tests data reponses by email id search
  const filteredData = filterData.filter((i) =>
    i.Email_Address.toLowerCase().includes(search.toLowerCase())
  );

  // handleUpdate function to update all streams scores to google sheet of stream recommendation Test google sheet using sheet db google api
  const handleUpdate = (item) => {
    if (item.Total_Score === undefined) {
      // if Total_Score column is not present in google sheet, the below code will execute
      // fetching an sheet db api to access the required data in google sheet
      fetch(
        `https://sheetdb.io/api/v1/bhymdl2yiryk4/Email_Address/${item.Email_Address}`,
        {
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
              Science_With_Bio_Score: item.science_bio_score,
              Science_With_Math_Score: item.science_math_score,
              Aptitude_Score:
                item.humanities_aptitude_score +
                item.commerce_aptitude_score +
                item.science_bio_aptitude_score +
                item.science_math_aptitude_score,
              Interests_Score:
                item.humanities_interests_score +
                item.commerce_interests_score +
                item.science_bio_interests_score +
                item.science_math_interests_score,
              Total_Score: item.total_score,
            },
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  // after component rendering, the below effect will run only once with empty depenpency array
  useEffect(() => {
    // token varaible to get token value
    const token = Cookies.get("token");
    if (!token) {
      // if token is undefined, notFound Component will be navigated
      navigate("/notFound");
    }
    setFilterData(filteredData);
  }, [search]);

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
            onClick={() => navigate("/sendAssessments", { state: data })}
            className='admin-desktop-header-navbar-link'
          >
            Assessments
          </p>
          {/* when clicking this Test Report text, it'll navigates to test report route */}
          <p
            onClick={() => navigate("/testReport", { state: data })}
            className='admin-desktop-header-navbar-link'
          >
            Test Report
          </p>
          {/* when clicking this Admin text, it'll navigates to admin login route and agains admin can access all routes */}
          <p
            className='admin-desktop-header-navbar-link'
            onClick={() => navigate("/adminLogin")}
          >
            Admin
          </p>
        </div>
        {/* nav header for mobile  with Logo and components Dashboard, Assessments, Test Report and Admin */}
        <div className='admin-mobile-header-navbar-container'>
          <Popup
            contentStyle={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "white",
            }}
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
                onClick={() => navigate("/dashboard", { state: data })}
                className='admin-header-navbar-link'
              >
                Dashboard
              </li>
              {/* when clicking this Assessments text, it'll navigates to send assessments route */}
              <li
                onClick={() => navigate("/sendAssessments", { state: data })}
                className='admin-header-navbar-link'
              >
                Assessments
              </li>
              {/* when clicking this Test Report text, it'll navigates to test report route */}
              <li
                onClick={() => navigate("/testReport", { state: data })}
                className='admin-header-navbar-link'
              >
                Test Report
              </li>
              {/* when clicking this Admin text, it'll navigates to admin login route and agains admin can access all routes */}
              <li
                onClick={() => navigate("/adminLogin")}
                className='admin-header-navbar-link'
              >
                Admin
              </li>
            </ul>
          </Popup>
        </div>
      </div>
      {/* table container with search, filter by date and table data */}
      <div className=''>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Stream Recommendation Test Tabulation Data
        </h1>
        {/* search input container */}
        <div className='input-label-container text-center'>
          <label htmlFor='search'>Search by Student Email :</label>
          <input
            id='search'
            value={search}
            type='text'
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            style={{ marginBottom: "20px", marginLeft: "25px" }}
            className='input-search'
          />
        </div>
        {/* filter with start date, end date and filter button */}
        <div className='date-filter'>
          <div className='display-between'>
            Start Date:{"   "}
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </div>
          <div className='display-between'>
            End Date:{" "}
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </div>
          <button
            style={{ padding: "2px", width: "60px" }}
            onClick={handleFilter}
          >
            Filter
          </button>
        </div>

        {/* desktop table container with table of stream recommendation test data respones */}
        <div className='d-none d-lg-block'>
          {filteredData.length > 0 ? (
            <div style={{ minHeight: 100, width: "95%", margin: "auto" }}>
              <DataGrid
                rows={filterData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 15, 20]}
                getRowClassName={(params) => "table-cell"}
              />
            </div>
          ) : (
            <p className='text-center'> No Data Found</p>
          )}
        </div>
        {/* mobile table container with table of stream recommendation test data responses */}
        <div className='d-lg-none mobile-table-container'>
          {filteredData.length > 0
            ? filteredData.map((item, index) => (
                <div className='table-data-container'>
                  <div className='table-data'>
                    <p className='th'>Id</p>
                    <p className='td'>{item.id}</p>
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ textAlign: "center", marginRight: "20px" }}>
                      <button
                        className='view-button'
                        onClick={() => {
                          navigate("/studentChart", { state: item });
                          handleUpdate(item);
                        }}
                      >
                        View Score
                      </button>
                    </div>
                    {/* clicking view Data button it'll navigates to studentBarChart route */}
                    <div style={{ textAlign: "center" }}>
                      <button
                        style={{ backgroundColor: "lightgrey" }}
                        className='view-button'
                        onClick={() =>
                          navigate("/studentBarChart", { state: item })
                        }
                      >
                        View Data
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : "No Data Found"}
        </div>
      </div>
    </>
  );
}

export default TestReport;