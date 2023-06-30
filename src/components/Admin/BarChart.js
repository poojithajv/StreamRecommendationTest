// BarChart component is about score card design,downloading score card,sending scores to student through emails including cc 
// import react, jspdf, @emailjs/browser, react-bootstrap, react-to-print, react-router-dom, recharts and css files index.css, bootstrap/dist/css/bootstrap.min.css to render BarChart component
import React, { useRef, useState } from 'react'
import jsPDF from 'jspdf'; 
import emailjs from '@emailjs/browser';
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useReactToPrint } from "react-to-print";
import { useLocation,useNavigate } from 'react-router-dom';
import { BarChart,Tooltip,Cell,Bar,CartesianGrid,XAxis,YAxis} from 'recharts';
import './index.css'

function StudentBarChart() {
  // detailsPdf is a useref hook used to persist values between renders
    const detailsPdf = useRef();
  // location varaiable to get location of the testReports route and state
  const location=useLocation()
  // useState of data to store Freshers Junior test data responses 
  const [data,setData]=useState(location.state)
  // navigate variable used to naviagating to different routes
  const navigate=useNavigate()
  // mailId usestate to store cc mail id's 
  const [mailId,setMailId]=useState(null)
  // isOpen usestate to store boolean values to open or close modal
  const [isOpen,setIsOpen]=useState(false)
  // colors for Barchart
  const COLORS = ["#8884d8", "#82ca9d","#AF19FF","#FF8042","#FFBB28"];
  // aptitude score of all streams
  const aptitude_score=data.humanities_aptitude_score+data.commerce_aptitude_score+data.science_bio_aptitude_score+data.science_math_aptitude_score
  // interest score of all streams
  const interests_score=data.humanities_interests_score+data.commerce_interests_score+data.science_bio_interests_score+data.science_math_interests_score
  // streams array with all streams name, aptitude and interest scores
  const streams=[['Humanities',data.humanities_aptitude_score,data.humanities_interests_score],['Commerce',data.commerce_aptitude_score,data.commerce_interests_score],['Science (Bio)',data.science_bio_aptitude_score,data.science_bio_interests_score],['Science (Math)',data.science_math_aptitude_score,data.science_math_interests_score]]

  // BarchartData is bar chart Data of all streams total scores of stream recommendation test 
  const BarchartData=[
    {
        name:'Commerce',
        score:data.commerce_score
    },
    {
        name:'Humanities',
        score:data.humanities_score
    },
    {
        name:'Science (Bio)',
        score:data.science_bio_score
    },
    {
        name:'Science (Math)',
        score:data.science_math_score
    }
  ]
  BarchartData.sort((a,b)=>b.score-a.score)

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
    <div className='barchart-container'>
        {/* table with low, medium and high interest of all streams aptitude and interest scores data */}
        <div ref={detailsPdf} className="barchart-container-responsive">
          <div className="tables-container">
        <div className='table-container'>
            <h1 className='barchart-heading'>Stream wise aptitude and interest score</h1>
        <table border="2px" style={{margin:'auto'}}>
        <thead>
                <tr>
                    <th>Stream</th>
                    <th>Aptitude</th>
                    <th>Interest</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {streams.map((item,index) =><tr>
                    <td>{item[0]}</td>
                    <td>{item[1]}</td>
                    <td>{item[2]}</td>
                    <td>{item[1]+item[2]}</td>
                </tr>)}
            </tbody>
        </table>
        </div>
        {/*All Streams Scores of Student in Stream Recommendation Test  */}
        <div className='table-container'>
        <h1 className='barchart-heading'>Student interest according to stream</h1>
            <table border="2px" style={{margin:'auto'}}>
            <thead>
                    <tr>
                        <th>Stream</th>
                        <th>Aptitude</th>
                        <th>Interest</th>
                    </tr>
                </thead>
                <tbody>
                    {streams.map((item,index) =><tr>
                        <td>{item[0]}</td>
                        <td>{item[1] > 0 && item[1]<2 ? 'Low' : (item[1] > 1 && item[1] < 4 ? 'Medium' : 'High' )}</td>
                        <td>{item[2] > 0 && item[2]<6 ? 'Low' : (item[2] > 5 && item[2] < 11 ? 'Medium' : 'High' )}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
        </div>
        <div className="chart-buttons-container">
        <div className='table-container'>
            <h1 className='barchart-heading'>All streams Total Score Bar Chart</h1>
            {/* bar chart of all streams total scores of stream recommendation test */}
            <BarChart width={500} height={400} data={BarchartData} margin={{
                top: 30,
                right: 20,
                left: 0,
                bottom: 5
            }} className='barchart'>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip wrapperStyle={{ top: 0, left: 0 }}/>
            <Bar dataKey="score" fill="green" barSize={40}
                >   
            {
                BarchartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index%20]} />
                ))
            }
            </Bar>
            <XAxis dataKey="name" style={{fontSize:'12px',fontWeight:'bold'}} />
            <YAxis type="number" style={{fontSize:'15px',fontWeight:'bold'}} domain={[0, 20]}/>
            </BarChart>
            </div>
        
        <div className="barchart-buttons-container">
      {/* By clicking Download button, pdf with student data can be dowloaded */}
      <button type='button' style={{backgroundColor:'cyan',color:'white',padding:'10px',border:'none',fontSize:'15px',marginRight:'20px'}} onClick={generatePdf} >
        Download
      </button>
      {/* By clicking the Send Email button, the boolean value of isOpen will be changed */}
      <button style={{backgroundColor:'darkgrey',color:'white',padding:'10px',border:'none',fontSize:'15px',marginRight:'20px'}} onClick={()=> sendMail(data)} className='send'>Send Email</button>
      {/* By clicking the Send Email button, the boolean value of isOpen will be changed */}
      <button style={{backgroundColor:'blue',color:'white',padding:'10px',border:'none',fontSize:'15px',marginRight:'20px'}} onClick={()=> navigate('/studentChart',{state:data})}>View Score</button>
      </div>
      </div>
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

export default StudentBarChart