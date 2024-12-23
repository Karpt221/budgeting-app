import '../App.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';  
import { useEffect, useState } from 'react';  

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const navigate = useNavigate();  

  // Check if the user is logged in by checking for a token in localStorage  
  useEffect(() => {  
    const token = localStorage.getItem('token');  
    setIsLoggedIn(!!token);
  }, []);  

  const handleLogout = () => {  
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };  

  return (
    <div>
       {isLoggedIn ? (  
          <>  
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>  
              Logout  
            </button>  
          </>  
        ): <Link to='/auth/sign-in'>Sign In</Link>}  
      <Outlet context={{ setIsLoggedIn }} />  
    </div>
  );
};

export default App;
