import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
const VITE_IMAGE = import.meta.env.VITE_IMAGE;
const VITE_course_items = import.meta.env.VITE_course_items;
const VITE_add_buy_course = import.meta.env.VITE_add_buy_course;
const Courses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;

      try {
        const coursesResponse = await axios.get(VITE_course_items, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses(coursesResponse.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const handleBuyCourse = async (courseId) => {
    if (!token) {
      alert("Please log in to buy a course.");
      return;
    }

    try {
      const response = await axios.post(
        VITE_add_buy_course,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error buying course:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to buy course");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Available Courses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
            key={course._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img 
              src={course.image ||VITE_IMAGE} 
              alt={course.title} 
              className="w-full h-48 object-cover"
            />
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                {course.category}
              </span>
              <p className="text-gray-600 mb-4">{course.details}</p>
              
              <button 
                onClick={() => handleBuyCourse(course._id)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Buy Course
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;