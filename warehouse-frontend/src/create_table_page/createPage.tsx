import {useState } from "react";
import "./createPage.css"
import Snackbar from '@mui/material/Snackbar';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";




function CreatePage() {
    const navigate = useNavigate();
  const [item, setItem] = useState({
    name: "",
    description: "",
    quantity: "",
    location_id: "",
    status: "FULL",
  });
  const emptyItem = {
  name: "",
  description: "",
  quantity: "",
  location_id: "",
  status: "FULL",
};

  const [imageFile, setImageFile] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e: any) {
    setImageFile(e.target.files[0]);
  }

  function handleSnackBarClose() {
    setSuccess(false);
  }
  function handleSubmit(e: any) {
  e.preventDefault();
  console.log(Number(item.location_id));
  

  fetch("http://localhost:8080/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: item.name,
      description: item.description,
      quantity: Number(item.quantity),
      locationId: Number(item.location_id),
      status: item.status,
    }),
  })
    .then(res => {
        if(!res.ok) throw new Error("Failed to create the item")
            console.log("Item Created Successfully");
            setSuccess(true)
            setItem(emptyItem)
            
        })
    .then(data => console.log(data))
    .catch(err => console.log(err));
}
  return (
    
    <div className="create-container">
      
        <Button
        sx={{
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
            backgroundColor: "#115293",
            },      
        }}
        onClick={() => navigate("/inventory")}
        >
        Back
        </Button>
        {success && (
            <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={3000}
            open={success}
            onClose={handleSnackBarClose}
            message="Item Added"
            />
        )}
        
      <h2 className="title">Create Item</h2>

      <form className="create-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Item name"
          value={item.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={item.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={item.quantity}
          onChange={handleChange}
          min="0"
        />

        <input
          type="number"
          name="location_id"
          placeholder="Shelf number"
          value={item.location_id}
          onChange={handleChange}
        />

        <select
          name="status"
          value={item.status}
          onChange={handleChange}
        >
          <option value="FULL">FULL</option>
          <option value="PARTIAL">PARTIAL</option>
        </select>

        {/* <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        /> */}

        <button type="submit">Create Item</button>
      </form>
    </div>
  );



}

export default CreatePage