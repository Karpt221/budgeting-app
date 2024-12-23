import { useState } from 'react';  
import { useOutletContext } from 'react-router-dom'; 
import { Link } from 'react-router-dom';   
const SignIn = () => {  
  const [formData, setFormData] = useState({ email: '', password: '' });  
  const [message, setMessage] = useState('');  
  const { setIsLoggedIn } = useOutletContext();

  const handleChange = (e) => {  
    setFormData({ ...formData, [e.target.name]: e.target.value });  
  };  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      const response = await fetch('/api/auth/sign-in', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(formData),  
      });  
      const data = await response.json();  
      if (response.ok) {  
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setMessage('Sign-in successful!');  
      } else {  
        setMessage(data.message || 'Sign-in failed.');  
      }  
    } catch (error) {  
      console.error(error);
      setMessage('An error occurred.');  
    }  
  };  

  return (  
    <div>  
      <h2>Sign In</h2>  
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
        <button type="submit">Sign In</button>  
      </form>  
      <Link to="/auth/sign-up">Sign Up</Link>
      {message && <p>{message}</p>}  
     
    </div>  
  );  
};  

export default SignIn;