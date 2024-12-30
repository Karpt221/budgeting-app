import { useState } from 'react';
import styles from './SidebarContextMenu.module.css';
import { useNavigate } from 'react-router-dom';  
import menuIcon from '../../../assets/sidebarMenuArrow.svg';
import logOutIcon from '../../../assets/logOut.svg';

function SidebarContextMenu({userEmail}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();  
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('budgeting-user-token');
    navigate('/sign-in');
  };
  return (
    <div className={styles.contextMenuContainer}>
      <button onClick={toggleMenu} className={styles.contextMenuButton}>
        <span>{userEmail && userEmail}</span>
        <img src={menuIcon} alt="" />
      </button>
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.contextMenu}>
            <ul>
              <li>
                <button onClick={handleLogout}>
                  <img src={logOutIcon} alt="" />Log Out
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarContextMenu;
