import React from 'react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'

const PublicLayout = ({ children }) => {
  return (
    <div>
      <PublicHeader />
      <div className="public-content">{children}</div>
      <PublicFooter />
    </div>
  )
}
export default PublicLayout
