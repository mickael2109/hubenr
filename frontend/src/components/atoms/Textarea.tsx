import React from 'react'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea: React.FC<Props> = (props) => {
  return (
    <textarea
      rows={3}
      className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
      {...props}
    />
  )
}

export default Textarea
