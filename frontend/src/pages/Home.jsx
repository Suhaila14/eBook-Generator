import { useState } from "react";
import axios from "axios";

function Home() {
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateEbook = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ebooks/generate",
        formData,
      );

      alert("Ebook Generated Successfully");
      console.log(res.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">AI Ebook Creator</h1>

      <div className="card p-4 shadow">
        <input
          type="text"
          placeholder="Ebook Title"
          name="title"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Topic"
          name="topic"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <textarea
          placeholder="Description"
          name="description"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Category"
          name="category"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <button className="btn btn-primary" onClick={generateEbook}>
          {loading ? "Generating..." : "Generate Ebook"}
        </button>
      </div>
    </div>
  );
}

export default Home;
