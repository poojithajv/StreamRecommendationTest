// Not Found component will render while accessing wrong paths
// import AdminLogin.css file for styling
import "./AdminLogin.css";
import {useNavigate} from 'react-router-dom'

const NotFound = () => {
  // navigate variable is used to navigating to different routes
  const navigate=useNavigate()
  return (
    <div className='not-found-container'>
      <img
        className='not-found-img'
        src='https://res.cloudinary.com/dahw90b2z/image/upload/v1649202458/erroring_1_wmrpgf.png'
        alt='page not found'
      />
      <h1 className='no-found-heading'>Page Not Found</h1>
      <p>we are sorry, the page you requested could not be found</p>
      <p onClick={()=>navigate('/')}>Please go back to homepage</p>
    </div>
  );
};

export default NotFound;