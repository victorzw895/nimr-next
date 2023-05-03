import { FunctionComponent } from "react";
import { Inter } from 'next/font/google'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({children}) => {
  return (
    <>
      <p className="text-2xl text-lightest text-center py-10 ">App</p>
      {children}
    </>
  )
}

export default Layout;