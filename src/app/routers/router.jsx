import { createBrowserRouter } from 'react-router-dom';
import App from '../components/App.jsx';
import SignIn from '../components/SignIn.jsx';
import SignUp from '../components/SignUp.jsx';
import Workspace from '../components/Workspace.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/auth/sign-in', element: <SignIn /> },
      { path: '/auth/sign-up', element: <SignUp /> },
      { path: '/workspace', element: <Workspace /> },
    ],
  },
]);

export default router;
