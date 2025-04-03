import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const Courses = () => {
  const { token } = useAuth(); // Get token from context
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;

      try {
        // ✅ Fetch all courses
        const coursesResponse = await axios.get("http://localhost:5001/api/courses/items", {
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
        "http://localhost:5002/api/auth/add-buy-course",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error buying course:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to buy course");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h2>Available Courses</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {courses.map((course) => (
          <div key={course._id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
            <img 
              src={course.image || "https://via.placeholder.com/150"} 
              alt={course.title} 
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} 
            />
            <h3>{course.title}</h3>
            <p>{course.category}</p>
            <p>{course.details}</p>
            <button 
              onClick={() => handleBuyCourse(course._id)} 
              style={{ marginTop: "10px", padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Buy Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
