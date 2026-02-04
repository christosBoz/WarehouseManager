import {useState } from "react";


function DataInput() {
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

    function handleChange(e: any) {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  }


  function handleSubmit(e: any) {
  e.preventDefault();
  console.log("Submitted for now");
  

//   fetch("http://localhost:8080/api/items", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       name: item.name,
//       description: item.description,
//       quantity: Number(item.quantity),
//       locationId: Number(item.location_id),
//       status: item.status,
//     }),
//   })
//     .then(res => {
//         if(!res.ok) throw new Error("Failed to create the item")
//             console.log("Item Created Successfully");
//             setSuccess(true)
//             setItem(emptyItem)
            
//         })
//     .then(data => console.log(data))
//     .catch(err => console.log(err));
}
    return (
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
    )
}

export default DataInput