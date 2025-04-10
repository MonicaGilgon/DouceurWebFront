import React from 'react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <PublicHeader />
      <div
        className="public-content"
        style={{
          flex: 1, // esto empuja el footer al final
        }}
      >
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
