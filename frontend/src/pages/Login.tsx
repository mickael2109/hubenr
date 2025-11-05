import * as React from 'react';
import AuthLayout from '../components/templates/AuthLayout';
import LoginForm from '../components/organisms/LoginForm';
import logo from "../assets/logo.png"

const Login: React.FC = () => {

  return (
    <AuthLayout>
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-0 rounded-[28px] overflow-hidden bg-white/10 backdrop-blur-md  ring-1 ring-white/10">
        {/* Colonne gauche : Welcome */}
        <div className="relative p-8 md:p-12">
          <div className="h-full rounded-3xl p-8 md:p-12 ">
            <div className="flex items-center gap-2 mb-10">
              <div className="h-4 w-4 rounded-sm bg-blue-900/90" />
              <div className="h-4 w-6 rounded-sm bg-blue-900/60" />
            </div>

            {/* Logo */}
            <div className="mb-8">
              <img
                src={logo}
                alt="Logo "
                className="h-90 w-90 object-cover rounded-full"
              />
            </div>

            <div className="w-16 h-1 bg-blue-900/50 rounded-full mb-6" />

            <p className="max-w-md text-black/80 leading-relaxed">
              CRM-App vous permet de garder le contrôle, gagner du temps et optimiser vos contenus en toute simplicité.
            </p>

            <button
              type="button"
              className='bg-blue-600 px-4 py-2 mt-4 text-white rounded-2xl'
            >
              Plus d'informations
            </button>
          </div>
        </div>

        {/* Colonne droite : panneau verre + formulaire */}
        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 md:p-10 ">
            <h2 className="text-black/80 text-3xl font-bold text-center mb-6">Se Connecter</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login
