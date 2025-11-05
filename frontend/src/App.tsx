import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages"
import AdminRoute from "./routes/AdminRoute"
import ProtectedRoute from "./routes/ProtectedRoute"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
     <BrowserRouter>
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="colored"
        />
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/admin/*"
          element={
             <ProtectedRoute>
              <AdminRoute />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
