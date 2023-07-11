// SendAssessments component is about displaying all students data respones of stream recommendation test in table
// import react, react-router-dom, js-cookie, xlsx, pizzip, @xmldom/xmldom, docxtemplater packages and reactjs-popup/dist/index.css and index.css files to render SendAssessments component
import React, { useRef, useState,useEffect } from "react";
import "reactjs-popup/dist/index.css";
import Cookies from "js-cookie";
import { read, utils } from "xlsx"; // used to read xlsx and xls files
import PizZip from "pizzip"; // used to read docx files
import { DOMParser } from "@xmldom/xmldom"; // parse xml into text
import Docxtemplater from "docxtemplater"; // used to read docx files
import {useLocation,useNavigate} from 'react-router-dom'
import "./index.css";

function SendAssessments(props) {
    // location varaiable to get location of the testReport route and state
    const {datat}=props
    const location=useLocation()
    // useState of data to store stream recommendation test data responses 
    const [data,setData]=useState(datat)
    // navigate variable used to naviagating to different routes
    const navigate=useNavigate()
    // useState of selectedFile to store file
    const [selectedFile, setSelectedFile] = useState(null);
    // useState of mailSentType to store type of mail sent
    const [mailSentType, setMailSentType] = useState("");
    // useState of allMails to store all mails
    const [allMails, setAllMails] = useState("");
    // useState of fileExtension to store extension of file
    const [fileExtension, setFileExtension] = useState("");
    // fileInputRef is react hook to persist values after render
    const fileInputRef = useRef(null);
    // triggers when file was uploaded
    const handleFileChange = (event) => {
      const file = event.target.files[0]; // imported file
      setSelectedFile(file);
      const reader = new FileReader(); // reads the imported file
      reader.onload = (e) => {
        const fileContents = e.target.result; // reads the file content from txt file
        console.log(fileContents);
        const fileExtension = file.name.split(".").pop().toLowerCase(); // used to know the file extension
        console.log(fileExtension);
        setFileExtension(fileExtension);
        // for txt file extension
        if (fileExtension === "txt") {
          const emailList = fileContents
            .split(" ")
            .map(
              (row) =>
                row.split(",").filter((field) => field.endsWith("@gmail.com")) // reads the txt file and filters all the emails
            )
            .filter((row) => row.length > 0);
          const mails = emailList.join(","); // changes the emails list to comma(,) separated string
          setAllMails(mails);
        } // for xlx and xlsx file extensions
        else if (fileExtension === "xls" || fileExtension === "xlsx") {
          // Handle XLS file
          const workbook = read(fileContents, { type: "binary" }); //reads the xls or xlsx file
          const sheetName = workbook.SheetNames[0]; // gets the sheet name
          const sheet = workbook.Sheets[sheetName];
          const data = utils.sheet_to_json(sheet, { header: 1 });
          const filteredData = data
            .map((row) => row.filter((field) => field.endsWith("@gmail.com"))) // filters all the mails
            .filter((row) => row.length > 0);
          const emailList = filteredData.flat().join(","); //change the mail list to string
          console.log(emailList);
          setAllMails(emailList);
          // for docx file extensions
        } else if (fileExtension === "docx") {
          // Handle DOCX file
          const arrayBuffer = e.target.result; // reads the data from document
          // calls the extractTextFromDocx and the function changes the data to readable format
          const textContent = extractTextFromDocx(arrayBuffer);
          console.log(textContent);
          const emailList = textContent
            .split(" ")
            .map(
              (row) =>
                row.split(",").filter((field) => field.endsWith("@gmail.com")) // filters all the mails
            )
            .filter((row) => row.length > 0);
          const mails = emailList.join(","); // changes the mail list into comma separated string
          setAllMails(mails);
        } else {
          alert(`Unsupported File Extension ${fileExtension}`);
        }
      };
      reader.readAsBinaryString(file);
    };
    // converts the docx binary data into readable format
    const extractTextFromDocx = (arrayBuffer) => {
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater();
      doc.loadZip(zip);
      const content = doc.getZip().files["word/document.xml"].asText();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const paragraphs = xmlDoc.getElementsByTagName("w:p");
      let textContent = "";
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const texts = paragraph.getElementsByTagName("w:t");
        for (let j = 0; j < texts.length; j++) {
          const text = texts[j];
          textContent += text.textContent + " ";
        }
      }
      return textContent.trim();
    };
    // triggers when send button clicked
    const handleSendEmail = () => {
      const subject = "Hello you are invited to write this test!"; // email subject
      const body = "Hello user, you're invited to write the test."; // email  body
      // send mail when file format is txt, docx, xls, xlsx
      if (
        fileExtension === "txt" ||
        fileExtension === "xls" ||
        fileExtension === "xlsx" ||
        fileExtension === "docx"
      ) {
        // send mail using mailto for uploaded document
        window.location.href = `mailto:overseaseducation1000@gmail.com?bcc=${allMails}&subject=${subject}&body=${body}`;
        // takes all input mails given by admin and send mails
      } else if (mailSentType === "manual") {
        const modifiedEmailAddresses = allMails // removes extra spaces and and extra commas
          .replace(/\s+/g, ",")
          .replace(/,\s*$/, "")
          .replace(/,,/, ",");
        console.log(modifiedEmailAddresses);
        // send mail using emailjs for manually entered mails
        window.location.href = `mailto:overseaseducation1000@gmail.com?bcc=${modifiedEmailAddresses}&subject=${subject}&body=${body}`;
      } else {
        alert("file format was not supported");
      }
    };
    // handles the input selected mail sent type
    const handleMailSentTypeChange = (event) => {
      setMailSentType(event.target.value);
    };

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
      <div>
        <div className="cards-container">
          <h1 style={{textAlign:'center',marginTop:'20px',marginBottom:'20px'}}>Send Assessments</h1>
          <div className='assessments-container'>
            <div >
              <input
                type='radio'
                value='file'
                id='file'
                name='send'
                onChange={handleMailSentTypeChange}
                className="radio"
              />
              <label htmlFor='file' className="label">Import from File</label>
              <br />
              <input
                type='radio'
                value='manual'
                id='manual'
                name='send'
                onChange={handleMailSentTypeChange}
                className="radio"
              />
              <label htmlFor='manual' className="label">Enter Email Id's</label>
              <br />
              {mailSentType !== "" && (
                <>
                  {mailSentType === "file" ? (
                    <>
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept='xls,xlsx,txt,docx'
                        className='file-upload-btn'
                      />
                      <p styles={{fontSize:'15px'}}>Support types: xls, xlsx, txt, docx</p>
                    </>
                  ) : (
                    <>
                      <textarea
                        rows='6'
                        cols='30'
                        onChange={(e) => setAllMails(e.target.value)}
                        className="textarea"
                        placeholder="Only enter comma or space separated email id's"
                      ></textarea>
                    </>
                  )}
                  <br />
                  <div className="button">
                  <button
                    className='send-ass-button'
                    onClick={handleSendEmail}
                  >
                    Send Email
                  </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default SendAssessments