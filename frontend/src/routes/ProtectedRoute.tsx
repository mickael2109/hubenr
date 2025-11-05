import { Navigate } from 'react-router-dom'
import Cookies from "js-cookie";
import { TOKEN_KEY } from '../storage/admin';
type Props = {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {

  const token = Cookies.get(TOKEN_KEY);
  
  if (!token) return <Navigate to="/" replace />
  return <>{children}</>
}

export default ProtectedRoute
