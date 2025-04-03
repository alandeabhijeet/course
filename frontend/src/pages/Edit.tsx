import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/courses/item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        const { 0: course, 1: userId } = response.data;
        console.log(course, userId);
        setTitle(response.data.title);
        setCategory(response.data.category);
        setDetails(response.data.details);
        setAvailable(response.data.available || false);
        setUserId(response.data.userId);
      } catch (error) {
        console.error("Error fetching course:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/courses/item/${id}`, { title, category, details, available, userId }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      navigate("/owner");
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error.message);
    }
  };

  if (loading) return <p>Loading course details...</p>;

  return (
    <div>
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <input placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} required />
        <br />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="development">Development</option>
          <option value="ai">AI</option>
          <option value="cloud">Cloud</option>
          <option value="electronics">Electronics</option>
        </select>
        <br />
        <label>
          Available:
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
        </label>
        <br />
        <button type="submit">Update Course</button>
      </form>
    </div>
  );
};

export default EditCourse;
