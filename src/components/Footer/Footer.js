import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="main">
      <div className="footer-main-container">
        <div className="social_media mt-2">
          <FaFacebook style={{ fontSize: "30px", color: "#FFFFFF" }} />
          <FaInstagram style={{ fontSize: "30px", color: "#FFFFFF" }} />
          <FaLinkedin style={{ fontSize: "30px", color: "#FFFFFF" }} />
          <FaTwitter style={{ fontSize: "30px", color: "#FFFFFF" }} />
        </div>
      </div>
      <hr className="my-hr" />
      <div className="below-container">
        <div className="sb__footer-copyright">
          <p>
            @{new Date().getFullYear()} STUDY GLOBAL{" "}
            <span> Overseas Education Consultants.</span> All right reserved.
          </p>
        </div>
        <div className="sb__footer-below-links">
          <a href="#">
            <div>
              <p>Terms & Conditions</p>
            </div>
          </a>
          <a href="#">
            <div>
              <p>Privacy</p>
            </div>
          </a>
          <a href="#">
            <div>
              <p>About</p>
            </div>
          </a>
          <a href="#">
            <div>
              <p>Contact</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
export default Footer;