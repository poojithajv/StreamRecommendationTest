// App component is about rendering different routes
// import react, react-router-dom, components like Home, AdminLogin, TestReport, Dashboard, BarChart, Chart, SendAssessments, NotFound, Test and TestInstructions to render App component
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home/Home'
import AdminLogin from './components/Admin/AdminLogin'
import TestReport from './components/Admin/TestReport'
import Dashboard from './components/Admin/Dashboard'
import BarChart from './components/Admin/BarChart'
import Chart from './components/Admin/Chart'
import SendAssessments from './components/Admin/SendAssessments'
import NotFound from "./components/Admin/NotFound";
import Test from './components/Student/Test'
import TestInstructions from './components/Student/TestInstructions'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home component */}
        <Route path='/' element={<Home />} />
        {/* Admin Login component*/}
        <Route path='/adminLogin' element={<AdminLogin />} />
        {/* Test Tabulation component */}
        <Route path='/testReport' element={<TestReport />} />
        {/* Dashboard component */}
        <Route path='/dashboard' element={<Dashboard />} />
        {/* Send Assessments component */}
        <Route path='/sendAssessments' element={<SendAssessments />} />
        {/* Student test chart component */}
        <Route path='/studentChart' element={<Chart />}/>
        {/* student test bar chart component */}
        <Route path='/studentBarChart' element={<BarChart />} />
        {/* not found component */}
        <Route path='/notFound' element={<NotFound />} />
        {/* Test component */}
        <Route path='/streamRecommendationTest' element={<Test />} />
        {/* TestInstructions component */}
        <Route path='/studentLogin' element={<TestInstructions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
