import React, { useState } from 'react';
import {
  FaHome,
  FaUser,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaRegChartBar,
  FaRegClipboard,
  FaPlus,
  FaEye,
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ handleLogout, setActiveComponent, role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Menu items based on role
  const menuItems = {
    registrar: [
      { name: 'Add Program', icon: <FaPlus />, component: 'courseForm' },
      { name: 'View Programs', icon: <FaEye />, component: 'coursesTable' },
      { name: 'Add Student', icon: <FaUser />, component: 'addStudent' },
      { name: 'View Students', icon: <FaEye />, component: 'StudentsTable' },
      { name: 'Add Fee Form', icon: <FaPlus />, component: 'addFeeForm' },

      {
        name: 'On Loan Students',
        icon: <FaRegClipboard />,
        component: 'studentsOnLoan',
      },
      {
        name: 'Not Completed',
        icon: <FaRegChartBar />,
        component: 'notCompleted',
      },

      {
        name: 'Completed Students',
        icon: <FaUser />,
        component: 'completedStudents',
      },
      {
        name: 'Travelled Students',
        icon: <FaRegChartBar />,
        component: 'travelledStudents',
      },
    ],
    finance: [
      { name: 'Manage Tuition', icon: <FaHome />, component: 'financePart' },
      { name: 'Other Fees', icon: <FaRegChartBar />, component: 'otherFees' },
      {
        name: 'Manage Expenses',
        icon: <FaRegClipboard />,
        component: 'expenses',
      },
      { name: 'View Programs', icon: <FaEye />, component: 'coursesTable' },
    ],
    director: [
      { name: 'View Students', icon: <FaEye />, component: 'StudentsTable' },
      { name: 'View Programs', icon: <FaEye />, component: 'coursesTable' },
      {
        name: 'On Loan Students',
        icon: <FaRegClipboard />,
        component: 'studentsOnLoan',
      },
      {
        name: 'Not Completed',
        icon: <FaRegChartBar />,
        component: 'notCompleted',
      },

      {
        name: 'Completed Students',
        icon: <FaUser />,
        component: 'completedStudents',
      },
      {
        name: 'Travelled Students',
        icon: <FaRegChartBar />,
        component: 'travelledStudents',
      },
    ],
  };

  return (
    <div
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
        isDarkMode ? 'dark' : ''
      }`}
    >
      <div className='sidebar-header'>
        <img
          src='https://eduserveducation.com/wp-content/uploads/2023/04/Eduserve-Education-ai-Copy.png'
          alt='Logo'
          className='logo'
        />
        <button onClick={toggleCollapse} className='collapse-btn'>
          <div className={`hamburger ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='line'></div>
            <div className='line'></div>
            <div className='line'></div>
          </div>
        </button>
      </div>

      <ul className='sidebar-menu'>
        {menuItems[role]?.map((item, index) => (
          <li key={index} onClick={() => setActiveComponent(item.component)}>
            {item.icon} {!isCollapsed && <span>{item.name}</span>}
          </li>
        ))}
      </ul>

      <div className='sidebar-footer'>
        <div className='toggle-dark-mode'>
          <button onClick={toggleDarkMode} className='dark-mode-btn'>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          {!isCollapsed && (
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </div>
        <button onClick={handleLogout} className='logout-btn'>
          <FaSignOutAlt /> {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
