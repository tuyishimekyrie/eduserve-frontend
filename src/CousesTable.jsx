import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CoursesTable.css'; // Assuming you will style your table here

const CoursesTable = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/programs');
        setPrograms(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch programs');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='course-table-container'>
      <table className='courses-table'>
        <thead>
          <tr>
            <th>PROGRAM NAME</th>
            <th>TUITION FEE</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((course) => (
            <tr key={course.id}>
              <td>{course.program_name}</td>
              <td>{course.tuition_fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoursesTable;
