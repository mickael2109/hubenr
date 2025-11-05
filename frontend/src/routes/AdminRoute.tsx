import {Routes, Route} from 'react-router-dom'
import { DashboardPage, InstallationPage, Layout, LeadsPage, QuotePage } from '../pages';

const AdminRoute = () => {
    return (
        <Routes>
          <Route element={<Layout/>}>
            <Route index element={<DashboardPage/>}/>
            <Route path="leads" element={<LeadsPage/>}/>
            <Route path="quotes" element={<QuotePage/>}/>
            <Route path="installations" element={<InstallationPage/>}/>
            
          </Route>
          
        </Routes>
    );
}

export default AdminRoute;
