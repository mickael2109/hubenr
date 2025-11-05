import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>


export const InputFile: React.FC<Props> = (props) => {
  return (
    <input
      accept="image/*"
      multiple
      className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
      {...props}
    />
  )
}