import styles from './App.module.css';
import { Outlet,useLocation } from 'react-router-dom';
import { useEffect } from 'react';  
function App() {
  const location = useLocation();  
  useEffect(() => {  
      const root = document.getElementById('root');  
      if (location.pathname === '/sign-in' || location.pathname === '/sign-up') {
        root.classList.add(styles.authBackground, styles.authPlacement);  
      }
      return () => {  
        root.className = '';  
      };  
  }, [location.pathname]);  

  return <Outlet/>
}

export default App;
