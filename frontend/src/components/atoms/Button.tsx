import React from 'react'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<Props> = ({ children, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-black text-white dark:bg-second_mc p-4 text-[14px] cursor-pointer"
    >
      {children}
    </button>
  )
}

export default Button