import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentTable from './StudentTable';
import AddStudentForm from './AddStudentForm';
import FinancePart from './FinancePart';
import StudentsOnLoan from './StudentsOnLoan';
import TravelledStudents from './TravelledStudents';
import NotCompletedStudents from './NotCompletedStudents';
import CompletedStudents from './CompletedStudents';
import OtherFees from './OtherFees';
import PaymentModal from './PaymentModal';
import Expenses from './Expenses';
import AddFeeForm from './AddFeeForm';
import CourseForm from './CourseForm';
import CoursesTable from './CousesTable';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './Dashboard.css';

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [activeComponent, setActiveComponent] = useState('');
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (!storedRole) {
      navigate('/login');
    } else {
      setRole(storedRole);
      fetchStudents();
      fetchFees();
    }
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/students');
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students data:', error);
      setError('Error fetching students data');
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/fees');
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/api/students/${id}/status`, {
        status,
      });
      fetchStudents(); // Refresh the students list after updating
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  return (
    <div className='dashboard-container'>
      <Sidebar
        handleLogout={handleLogout}
        setActiveComponent={setActiveComponent}
        role={role} // Pass the role to the Sidebar
      />

      <div className='content'>
        {activeComponent === 'addStudent' && <AddStudentForm />}
        {activeComponent === 'studentsOnLoan' && (
          <StudentsOnLoan students={students} />
        )}
        {activeComponent === 'notCompleted' && (
          <NotCompletedStudents students={students} />
        )}
        {activeComponent === 'financePart' && (
          <FinancePart students={students} />
        )}
        {activeComponent === 'otherFees' && <OtherFees students={students} />}
        {activeComponent === 'completedStudents' && (
          <CompletedStudents students={students} />
        )}
        {activeComponent === 'travelledStudents' && (
          <TravelledStudents
            students={students}
            loading={loading}
            error={error}
          />
        )}
        {activeComponent === 'expenses' && <Expenses />}
        {activeComponent === 'addFeeForm' && <AddFeeForm />}
        {activeComponent === 'courseForm' && <CourseForm />}
        {activeComponent === 'coursesTable' && (
          <CoursesTable students={students} />
        )}
        {activeComponent === 'StudentsTable' && ( // New condition for "View Students"
          <StudentTable students={students} updateStatus={updateStatus} />
        )}
        {isModalOpen && selectedStudent && (
          <PaymentModal student={selectedStudent} onClose={closeModal} />
        )}
        {activeComponent === '' && (
          <StudentTable students={students} updateStatus={updateStatus} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
