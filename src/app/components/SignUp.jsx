import { useState } from 'react';  
import { Link } from 'react-router-dom';  
const SignUp = () => {  
  const [formData, setFormData] = useState({ email: '', password: '' });  
  const [message, setMessage] = useState('');  

  const handleChange = (e) => {  
    setFormData({ ...formData, [e.target.name]: e.target.value });  
  };  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      const response = await fetch('/api/auth/sign-up', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(formData),  
      });  
      const data = await response.json();  
      if (response.ok) {  
        setMessage('Sign-up successful!');  
      } else {  
        setMessage(data.message || 'Sign-up failed.');  
      }  
    } catch (error) {  
      console.error(error);
      setMessage('An error occurred.');  
    }  
  };  

  return (  
    <div>  
      <h2>Sign Up</h2>  
      <form onSubmit={handleSubmit}>  
        <input  
          type="email"  
          name="email"  
          placeholder="Email"  
          value={formData.email}  
          onChange={handleChange}  
          required  
        />  
        <input  
          type="password"  
          name="password"  
          placeholder="Password"  
          value={formData.password}  
          onChange={handleChange}  
          required  
        />  
        <button type="submit">Sign Up</button>  
      </form>  
      <Link to="/auth/sign-in">Sign In</Link>
      {message && <p>{message}</p>}  
    </div>  
  );  
};  

export default SignUp;