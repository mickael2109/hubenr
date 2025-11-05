import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<Props> = (props) => {
  return (
    <input
      className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
      {...props}
    />
  )
}

export default Input
