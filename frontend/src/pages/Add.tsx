import React, { useState } from "react";
import axios from "axios";

const Add: React.FC = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("development");
  const [available, setAvailable] = useState(true);

  const handleAddCourse = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("User not authenticated");
      return;
    }

    try {
      // Create course
      const courseResponse = await axios.post(
        "http://localhost:5001/api/courses/item",
        { title, details, category, available },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Course added successfully");
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
      alert("Failed to add course");
    }
  };

  return (
    <div>
      <h2>Add Course</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="development">Development</option>
        <option value="ai">AI</option>
        <option value="cloud">Cloud</option>
        <option value="electronics">Electronics</option>
      </select>
      <label>
        Available:
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
      </label>
      <button onClick={handleAddCourse}>Add Course</button>
    </div>
  );
};

export default Add;
