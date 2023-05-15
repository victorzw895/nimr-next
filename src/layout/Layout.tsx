import { FunctionComponent } from "react";
import { Inter } from 'next/font/google'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({children}) => {
  return (
    <>
      <p className="text-2xl text-lightest text-center pt-10 pb-5 grow-0">App</p>
      {children}
    </>
  )
}

export default Layout;