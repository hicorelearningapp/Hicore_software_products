import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Homepage from './Homepage';

const Semiconductor = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Reusable tailwind classes to keep desktop exactly as it was
    const navItemClass = "flex flex-col rounded-[4px] px-[16px] py-[4px] cursor-pointer transition-colors";
    const linkTextClass = "font-arial font-bold text-[14px] leading-[28px]";

    return (
        <div className='scroll-smooth select-none'>
            {/* Navigation Bar */}
            <div className='flex justify-between items-center rounded-b-[4px] px-[24px] md:px-[36px] py-[20px] md:py-[28px] bg-[#053C61] sticky top-0 z-50'>
                
                {/* Logo Section */}
                <div className='flex flex-row rounded-[4px] md:px-[16px] py-[4px]'>
                    <h2 className={`${linkTextClass} text-white whitespace-nowrap`} style={{ fontFamily: "Arial, sans-serif" }}>
                        HiCore Sem 
                    </h2>
                </div>

                {/* ================= DESKTOP NAV (Hidden on Mobile) ================= */}
                <div className='hidden md:flex flex-row items-center justify-center gap-[20px] w-[90%]'>
                    <div className={navItemClass}>
                        <a href="/" className={`${linkTextClass} text-white`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Home
                        </a>
                    </div>
                    
                    <div className={`${navItemClass} text-white hover:bg-white hover:text-[#053C61]`}>
                        <a href="#services" className={linkTextClass} style={{ fontFamily: "Arial, sans-serif" }}>
                            Services
                        </a>
                    </div>

                    <div className={`${navItemClass} text-white hover:bg-white hover:text-[#053C61]`}>
                        <a href="contact" className={linkTextClass} style={{ fontFamily: "Arial, sans-serif" }}>
                            Contact Us
                        </a>
                    </div>
                </div>

                {/* ================= MOBILE TOGGLE (Hidden on Desktop) ================= */}
                <div className='md:hidden'>
                    <button onClick={toggleMenu} className='text-white p-2 focus:outline-none'>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* ================= MOBILE DROPDOWN MENU ================= */}
                {isOpen && (
                    <div className='absolute top-full left-0 w-full bg-[#053C61] border-t border-white/10 flex flex-col p-6 gap-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2'>
                        <a href="/" onClick={toggleMenu} className={`${linkTextClass} text-white border-b border-white/10 pb-2`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Home
                        </a>
                        <a href="#services" onClick={toggleMenu} className={`${linkTextClass} text-white border-b border-white/10 pb-2`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Services
                        </a>
                        <div onClick={toggleMenu} className={`${linkTextClass} text-white`} style={{ fontFamily: "Arial, sans-serif" }}>
                            Contact Us
                        </div>
                    </div>
                )}
            </div>

            {/* Page Content */}
            <div>
                <Homepage />
            </div>
        </div>
    )
}

export default Semiconductor;