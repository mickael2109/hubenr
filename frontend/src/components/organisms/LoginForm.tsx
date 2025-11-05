import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../app/store';
import { useEffect, useState } from 'react';
import { TOKEN_KEY, TOKEN_KEY_REFRESH } from '../../storage/admin';
import type { loginInterface } from '../../types/AuthInterface';
import { getAllUsers, getInfoUser } from '../../features/user/thunk';
import { authService } from '../../service/auth.service';
import { selectUserConnected } from '../../features/user/slice';
import type { UserInterface } from '../../types/UserInterface';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = Cookies.get(TOKEN_KEY);

  useEffect(() => { (async () => { await dispatch(getAllUsers("")).unwrap(); })(); }, [dispatch]);

   useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        const rep = await dispatch(getInfoUser(token));
        const payload = rep.payload as { success: boolean; data: { user: { role: string } } };
        if (payload.success) {
          navigate("/admin", { replace: true })
        }
      }
    };
    if (token) fetchUserInfo();
  }, [dispatch, navigate, token]);

  const [loginData, setLoginData] = useState<loginInterface>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(''); setLoading(true);
    try {
      const response = await authService.login(loginData);
      const data = response.data;
      
      
      if (data.success) {
        Cookies.set(TOKEN_KEY, data.data.accessToken);
        Cookies.set(TOKEN_KEY_REFRESH, data.data.refreshToken);
        const rep = await dispatch(getInfoUser(data.data.accessToken));

        
        const payload = rep.payload.data as UserInterface;
        
        const success = rep.payload.success as boolean;
        if (success) {
          
          dispatch(selectUserConnected(payload));
          
          navigate("/admin")
        }
      } else {
        setError("Autorisation en cours. Si le processus échoue, vérifiez votre nom ou votre mot de passe.");
      }
    } catch (err) {
      console.log("Erreur du connexion: ", err);
      setError("Erreur du connexion!");
    } finally {
      setLoading(false);
    }
  };

  // Determine if the submit button should be disabled
  const isDisabled = !loginData.email || !loginData.password || loading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-black/90">Email</label>
        <input
          type="text"
          name="email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          placeholder="Votre email"
          className="h-12 w-full rounded-full px-4 mt-2 bg-blue-300/15 text-black/90 placeholder-blue-700/30
                     ring-1 ring-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-600/60 transition text-[12px]"
        />
      </div>

      {/* mot de passe */}
      <div className="space-y-2 relative">
        <label className="text-sm font-medium text-black/90">Mot de passe</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            placeholder="Votre mot de passe"
            className="h-12 w-full rounded-full px-4 pr-10 mt-2 bg-blue-300/15 text-black/90 placeholder-blue-700/30
                      ring-1 ring-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-600/60 transition text-[12px]"
          />
          {/* Icône œil */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>
      </div>
      {/* Bouton gradient + loading */}
      <button
        type="submit"
        disabled={isDisabled}
        className='bg-blue-600 px-4 py-2 mt-4 text-white rounded-2xl'
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span>Connexion...</span>
          </>
        ) : 'Se Connecter'}
      </button>

      {error && (
        <div className='text-center text-sm mt-2 text-red-700 font-medium'>{error}</div>
      )}
    </form>
  )
}

export default LoginForm