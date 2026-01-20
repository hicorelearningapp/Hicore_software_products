import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Standard icons for hamburger
import Abouteqsoft from './Abouteqsoft';
import Eqsoftrequire from './Eqsoftrequire';
import Howitworks from './Howitworks';
import Keyfeatures from './Keyfeatures';
import Benefits from './Benefits';
import Footer from './Footer';

const Equipmenthome = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Common style for nav links
    const navLinkStyle = "font-arial font-bold text-[14px] leading-[28px] cursor-pointer transition-colors";

    return (
        <div className='scroll-smooth select-none'>
            {/* Header / Navbar */}
            <nav className='bg-[#053C61] sticky top-0 z-50 px-[24px] md:px-[36px] py-[20px] md:py-[28px] rounded-b-[4px]'>
                <div className='flex justify-between items-center  mx-auto'>
                    
                    {/* Logo Section */}
                    <div className='w-[10%] select-none flex items-center'>
                        <h2 className='font-bold text-[14px] md:text-[18px] text-white'
                            style={{ fontFamily: "Arial, sans-serif" }}>
                            HiCore Sem
                        </h2>
                    </div>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <div className='w-[90%] hidden md:flex flex-row items-center justify-center gap-[20px]'>
                        <a href="/hicore/semiconductor" className={`${navLinkStyle} text-white hover:text-blue-200`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Home
                        </a>
                        <a href="#howitworks" className={`${navLinkStyle} text-white hover:bg-white hover:text-[#053C61] px-[16px] py-[4px] rounded-[4px]`} style={{ fontFamily: "Arial, sans-serif" }}>
                            How It Works
                        </a>
                        <a href="#key-features" className={`${navLinkStyle} text-white hover:bg-white hover:text-[#053C61] px-[16px] py-[4px] rounded-[4px]`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Key Features
                        </a>
                        <a href="#why-us" className={`${navLinkStyle} text-white hover:bg-white hover:text-[#053C61] px-[16px] py-[4px] rounded-[4px]`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Why Us
                        </a>
                    </div>

                    {/* Mobile Hamburger Button (Hidden on Desktop) */}
                    <div className='md:hidden'>
                        <button onClick={toggleMenu} className='text-white focus:outline-none'>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isOpen && (
                    <div className='md:hidden absolute top-[70px] left-0 w-full bg-[#053C61] border-t border-white/10 flex flex-col p-[20px] gap-[15px] shadow-lg'>
                        <a href="/hicore/semiconductor" onClick={toggleMenu} className={`${navLinkStyle} text-white`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Home
                        </a>
                        <a href="#howitworks" onClick={toggleMenu} className={`${navLinkStyle} text-white`} style={{ fontFamily: "Arial, sans-serif" }}>
                            How It Works
                        </a>
                        <a href="#key-features" onClick={toggleMenu} className={`${navLinkStyle} text-white`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Key Features
                        </a>
                        <a href="#services" onClick={toggleMenu} className={`${navLinkStyle} text-white`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Why Us
                        </a>
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <div>
                <Abouteqsoft />
                <Eqsoftrequire />
                <Howitworks />
                <Keyfeatures />
                <Benefits />
                <Footer />
            </div>
        </div>
    );
}

export default Equipmenthome;