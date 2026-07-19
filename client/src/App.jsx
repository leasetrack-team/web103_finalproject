
import { useRoutes } from 'react-router-dom'
import './App.css'
import TenantHome from './pages/TenantHome';
import ManagerDashboard from './pages/ManagerDashboard';
import TechnicianRequests from './pages/TechnicianRequests';

function App() {

  let element = useRoutes([
    {
      path:"/tenant-home",
      element:<TenantHome/>
    },
    {
      path:"/manager-dashboard",
      element: <ManagerDashboard/>
    },
    {
      path: "technician-requests",
      element: <TechnicianRequests/>
    }
  ]);
 
  return (
    <>


     {element}

    </>
  )
}

export default App
