import React from 'react';
import Footer from '../components/Footer/Footer';
import NavBar from '../components/NavBar/NavBar';
import NavTab from '../components/NavTab/NavTab';

interface LayoutProps{
    children:any;
    showNavTab:Boolean;
}

export default function Layout(props:LayoutProps) {
    const navbarTab = props.showNavTab === true ? <NavTab /> : null;
    return (
        <>
         <NavBar/>
         {navbarTab}

        <main className="main--layout">
            <div className="container">
                {props.children}
            </div>
        </main>
        <Footer />
        </>
    )
}
