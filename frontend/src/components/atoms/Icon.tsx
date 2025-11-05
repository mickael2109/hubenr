import React from 'react'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const Icons: React.FC<Props> = ({ children, onClick, className }) => {
  return (
    <i className={className}  onClick={onClick}>
        {children}
    </i>
  )
}

export default Icons