import { useEffect, useState } from 'react';  
import { useNavigate } from 'react-router-dom';  

const Workspace = () => {  
  const [message, setMessage] = useState('');  
  const navigate = useNavigate();  

  useEffect(() => {  
    const fetchProtectedData = async () => {  
      const token = localStorage.getItem('token');  
      if (!token) {  
        navigate('/sign-in'); // Redirect to sign-in if no token  
        return;  
      }  

      try {  
        const response = await fetch('/api/protected', {  
          headers: { Authorization: `Bearer ${token}` },  
        });  
        if (response.ok) {  
          const data = await response.json();  
          setMessage(data.message || 'Protected content');  
        } else {  
          navigate('/sign-in'); // Redirect if token is invalid  
        }  
      } catch (error) {  
        console.error(error);
        navigate('/sign-in'); // Redirect on error  
      }  
    };  

    fetchProtectedData();  
  }, [navigate]);  

  return (  
    <div>  
      <h2>Protected</h2>  
      {message ? <p>{message}</p> : <p>Loading...</p>}  
    </div>  
  );  
};  

export default Workspace;