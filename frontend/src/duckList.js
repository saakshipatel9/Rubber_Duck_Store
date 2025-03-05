import React, { useState, useEffect } from 'react';
import axios from 'axios';
const DuckList = () => {
    const [ducks, setDucks] = useState([]);
    const [addForm, setAddForm] = useState(false);
    const [newDuck, setNewDuck] = useState({color: '',size: '',price: '',quantity: ''});
    const [editDuck, setEditDuck] = useState(null);
    
    useEffect(() => {
      axios.get('http://localhost:5000/api/ducks')
        .then((response) => {
          const sortedDucks = response.data.sort((a, b) => b.quantity - a.quantity);
          setDucks(sortedDucks);
        })
        .catch((e) => {
          console.error(e);
        });
    }, []);
    

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewDuck((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  

    const handleSubmit = (e) => {
      e.preventDefault();
      const { color, size, price, quantity } = newDuck;
    
      if (editDuck) { 
        axios.put(`http://localhost:5000/api/ducks/update/${editDuck.id}`, { color, size, price, quantity })
          .then(() => {
            setAddForm(false);
            setEditDuck(null);
            setNewDuck({ color: '', size: '', price: '', quantity: '' });
    
            axios.get('http://localhost:5000/api/ducks')
              .then((response) => {
                const sortedDucks = response.data.sort((a, b) => b.quantity - a.quantity);
                setDucks(sortedDucks); 
              });
          })
          .catch((e) => {
            console.error(e);
          });
      } else { 
        axios.post('http://localhost:5000/api/ducks/add', { color, size, price, quantity })
          .then(() => {
            setAddForm(false);
            setNewDuck({ color: '', size: '', price: '', quantity: '' });
    
            axios.get('http://localhost:5000/api/ducks')
              .then((response) => {
                const sortedDucks = response.data.sort((a, b) => b.quantity - a.quantity);
                setDucks(sortedDucks); 
              });
          })
          .catch((e) => {
            console.error(e);
          });
      }
    };
    
  
    const handleDelete = async (id) => {
      if (window.confirm("Delete Duck?")) {
        window.location.reload();
        try {
          await axios.delete(`http://localhost:5000/api/ducks/delete/${id}`);
          
        } 
        
        catch (e) {
          console.error(e);
        }
      }

    };
  
    const handleEdit = (duck) => {
      setEditDuck(duck);
      setNewDuck({
        color: duck.color,
        size: duck.size,
        price: duck.price,
        quantity: duck.quantity,
        
      });

      setAddForm(true);
    };
  
    return (
      <div id="page">
        <p><button onClick={() => {setAddForm(true);}}>Add Duck</button></p>
        {addForm && (
          <div>
            <form onSubmit={handleSubmit}>

              Color: <input type="text" name="color" value={newDuck.color} onChange={handleInputChange} readOnly={editDuck ? true : false} required /> 
              Size: <input type="text" name="size" value={newDuck.size} onChange={handleInputChange} readOnly={editDuck ? true : false} required /> 
              Price: <input type="number" name="price" value={newDuck.price} onChange={handleInputChange} required />
              Quantity: <input type="number" name="quantity" value={newDuck.quantity} onChange={handleInputChange} required />
              
              <button type="submit" onClick={() => window.location.reload()}> {editDuck? 'Edit' : 'Add'} </button>
              
              <button type="button" onClick={() => {
                  setAddForm(false);
                  setEditDuck(null); 
                  setNewDuck({ color: '', size: '', price: '', quantity: '' });
              }}>Cancel</button>
            
            </form>
          </div>
        )}

        <br />

        <table className="duckList">
          <thead>
            <tr>
              <th>ID</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {ducks.map(duck => (
              <tr key={duck.id}>
                <td>{duck.id}</td>
                <td>{duck.color}</td>
                <td>{duck.size}</td>
                <td>${duck.price}</td>
                <td>{duck.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(duck)}>Edit</button>
                  <button onClick={() => handleDelete(duck.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default DuckList;