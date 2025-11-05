type Props = {
  children: React.ReactNode
  title?: string
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Fond blanc + léger dégradé gris clair */}
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_-10%_-10%,#f5f5f5_0%,transparent_60%),radial-gradient(800px_500px_at_110%_0%,#e5e5e5_0%,transparent_55%),linear-gradient(120deg,#ffffff_0%,#f7f7f7_60%,#ffffff_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'400\' height=\'400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23cccccc\' stroke-opacity=\'.4\' stroke-width=\'6\'%3E%3Cpath d=\'M40 40h80a20 20 0 0120 20v80\' /%3E%3Cpath d=\'M280 320h80a20 20 0 0020-20v-80\' /%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: "600px 600px",
        }}
      />

      {/* Contenu centré */}
      <div className="relative w-full max-w-6xl">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
