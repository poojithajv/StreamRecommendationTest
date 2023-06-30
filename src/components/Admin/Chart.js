// Chart component is about score card design,downloading score card,sending scores to student through emails including cc 
// import react, jspdf, @emailjs/browser, react-bootstrap, react-to-print, react-router-dom, recharts and css files index.css, bootstrap/dist/css/bootstrap.min.css to render chart component
import React, { useRef, useState } from 'react'
import jsPDF from 'jspdf'; 
import emailjs from '@emailjs/browser';
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useReactToPrint } from "react-to-print";
import { useLocation,useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import './index.css'

function Chart() {
    // detailsPdf is a useref hook used to persist values between renders
    const detailsPdf = useRef();
    // location varaiable to get location of the studentChart route and state
    const location=useLocation()
    // navigate variable used to naviagating to different routes
    const navigate=useNavigate()
    // useState of data to store the stream recommendation test data responses
    const [data,setData]=useState(location.state)
    // mailId usestate to store cc mail id's 
    const [mailId,setMailId]=useState(null)
    // isOpen usestate to store boolean values to open or close modal
    const [isOpen,setIsOpen]=useState(false)
    // colors for piechart
    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
    // aptitude score of all streams
    const aptitude_score=data.humanities_aptitude_score+data.commerce_aptitude_score+data.science_bio_aptitude_score+data.science_math_aptitude_score
    // interest score of all streams
    const interests_score=data.humanities_interests_score+data.commerce_interests_score+data.science_bio_interests_score+data.science_math_interests_score
    // pieData is pie chart Data of stream recommendation test aptitude and interst scores
    let pieData=[
        {
            name:'Aptitude',
            value:aptitude_score 
        },
        {
            name:'Interests',
            value:interests_score
        }
      ]

    // generatePdf function used to generate the pdf which includes student details along with all streams aptitude and interest scores piechart when clicking on the download button in the component
    const generatePdf = useReactToPrint({
      content: () => detailsPdf.current,
      documentTitle: data.Email_Address.slice(0,data.Email_Address.indexOf("@")),
      onAfterPrint: () => alert("pdf downloaded"),
    });
    // handle Submit function used to sent email to students regarding candidate details and scores through email
    const handleSubmit = (item) => {
      data.new_Mail=item
      data.aptitude_score=aptitude_score
      data.interests_score=interests_score
        emailjs
        .send(
          "service_ymf4cxn",
          "template_r90aam3",
          {
            ...data,
          },
          "l586GhABgihjc8ccg"
        )
        .then((result) => {
          console.log("Email sent successfully:", result.text);
          alert(`Email sent to ${data.Email_Address}`);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
    };
    // sendMail function used to set boolean value of isOpen variable
    const sendMail=(data)=>{
      setIsOpen(!isOpen)
    }
    // handleClose function used to set boolean value of isOpen variable
    const handleClose=()=>{
      setIsOpen(!isOpen)
    }
    
  return (
    // chart container with student, piechart, download and send email button
    <div  className="chart-container" >
      <div ref={detailsPdf} className="charts">
        <div className='details'>
        <h1 style={{fontSize:'30px',fontWeight:'bold'}}>Student Details:</h1>
        <p>Name : {data.Full_Name}</p>
        <p>Email : {data.Email_Address}</p>
        <p>Phone Number : {data.Phone_Number}</p>
        <p>Parent Email Id: {data.Parent_Email_Id}</p>
        <p>Parent Phone Number  :{data.Parent_Phone_Number}</p>
        <p>Total Score : {data.Score}</p>
        <p>Aptitude Score : {data.humanities_aptitude_score+data.commerce_aptitude_score+data.science_bio_aptitude_score+data.science_math_aptitude_score}</p>
        <p>Interests Score : {data.humanities_interests_score+data.commerce_interests_score+data.science_bio_interests_score+data.science_math_interests_score}</p>
        </div>
      <div >
        {/* all streams aptitude and interest scores pie chart */}
        <PieChart width={700} height={400} className='piechart'>
          <Pie
            data={pieData}
            color="#000000"
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            fill="#8884d8"
          >
            {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        </div>
      </div>
      <div className='button-container'>
      {/* By clicking Download button, pdf with student data can be dowloaded */}
      <button type='button' style={{backgroundColor:'cyan',width:'100px',height:'50px'}} className='send' onClick={generatePdf} >
        Download
      </button>
      {/* By clicking the Send Email button, the boolean value of isOpen will be changed */}
      <button style={{backgroundColor:'darkgrey',marginRight:'20px',width:'100px',height:'50px'}} onClick={()=> sendMail(data)} className='send'>Send Email</button>
      <button style={{backgroundColor:'blue',marginRight:'20px',width:'100px',height:'50px'}} onClick={()=> navigate('/studentBarChart',{state:data})} className='send'>View Data</button>
      </div>
      {/* react-bootstrap modal for including cc */}
        <Modal 
        show={isOpen} 
        onRequestClose={handleClose}
      >
      <Modal.Header closeButton  onClick={handleClose}>
        <Modal.Title>Email Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form.Group >
              <Form.Label>Student Mail ID: </Form.Label>
              <Form.Control type="text" value={data.Email_Address}/>           
          </Form.Group>
          <Form.Group >
              <Form.Label>CC Mail ID's: </Form.Label>
              <Form.Control type="text" value={mailId} onChange={(e)=>setMailId(e.target.value)}/>           
          </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        {/* when clicking send Email buton, email will be sent to student */}
          <Button variant="primary" type="submit" onClick={() => {handleSubmit(mailId)
          setIsOpen(!isOpen)}}>
              Send Email
          </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default Chart