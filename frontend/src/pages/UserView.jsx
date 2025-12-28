import axios from 'axios'
import { useState, useEffect } from 'react'
import './UserView.css'

function UserView() {

  useEffect(()=>{
    fetchUsers();
  },[]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/users")
      setUsers(res.data)
    }
    catch(err){
      console.error("Error fetching users:",err.message)
      alert("Failed to fetch users. Please try again.")
    }
  };

  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [selectedUserId, setSelectedUserId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // CREATE - Add new user
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in both name and email')
      return
    }

    try {
      await axios.post("http://localhost:5001/users",{
        name: formData.name.trim(),
        email: formData.email.trim()
      });
      setFormData({ name: '', email: '' })
      setSelectedUserId(null) 
      fetchUsers(); 
    }
    catch(err){
      console.error("Error creating user:",err.message)
      alert("Failed to create user. Please try again.")
    }
   }

  // UPDATE - Update existing user
  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in both name and email')
      return
    }

   try{
    await axios.put(`http://localhost:5001/users/${selectedUserId}`,
      {
        name: formData.name.trim(),
        email: formData.email.trim()
      }
    )
    setFormData({ name: '', email: '' })
    setSelectedUserId(null)
    fetchUsers();
    alert("User updated successfully!")
   }
   catch(err){
    console.error("Error updating user:",err.message)
    alert("Failed to update user. Please try again.")
   }};

  // DELETE - Delete user
  const handleDelete = async(e, userId) => {
    e.stopPropagation() // Prevent grid item click
    if (window.confirm('Are you sure you want to delete this user?')){
     try{
      await axios.delete(`http://localhost:5001/users/${userId}`)
      fetchUsers();
      alert("User deleted successfully!")
    }
    catch(err){
      console.error("Error deleting user:",err.message)
      alert("Failed to delete user. Please try again.")
    }}
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedUserId) {
      handleUpdate()
    } else {
      handleCreate()
    }
  }

  const handleGridItemClick = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || ''
    })
    setSelectedUserId(user.id)
  }

  const handleClear = () => {
    setFormData({
      name: '',
      email: ''
    })
    setSelectedUserId(null)
  }

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="title">User Management</h1>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter email"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">
              {selectedUserId ? 'Update' : 'Create'}
            </button>
            {selectedUserId && (
              <>
                <button type="button" onClick={handleClear} className="clear-button">
                  Clear
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleDelete(e, selectedUserId)} 
                  className="delete-button-form"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </form>

        <div className="data-section">
          <h2 className="section-title">Users Grid</h2>
          {users.length > 0 ? (
            <div className="grid-container">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className={`grid-item ${selectedUserId === user.id ? 'selected' : ''}`}
                  onClick={() => handleGridItemClick(user)}
                >
                  <button
                    className="delete-button-grid"
                    onClick={(e) => handleDelete(e, user.id)}
                    aria-label="Delete user"
                    title="Delete user"
                  >
                    ×
                  </button>
                  <div className="grid-content">
                    <p className="grid-label">Name:</p>
                    <p className="grid-value">{user.name}</p>
                    <p className="grid-label">Email:</p>
                    <p className="grid-value">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserView

