import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const Buy = () => {
  const { token } = useAuth(); // Get token from context
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;

      try {
        const coursesResponse = await axios.get("http://localhost:5001/api/courses/items/buy", {
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

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h2>Buy Courses</h2>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buy;
