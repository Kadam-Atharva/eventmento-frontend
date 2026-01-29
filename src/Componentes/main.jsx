'use client';
import React from 'react';
import CursorEffect from './CursorEffect';

import { useAuth } from "react-oidc-context";

const Main = () => {
    const auth = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
            <CursorEffect />
            {/* Header - Floating & Transparent Blue */}
            <header className="fixed top-4 left-4 right-4 md:left-10 md:right-10 z-40 backdrop-blur-md bg-blue-50/80 border border-blue-100 rounded-2xl py-4 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="text-2xl font-bold tracking-tight text-blue-600 relative group cursor-none">
                        EventMento
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8 items-center">
                            {['Features', 'Events', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href={item === 'Contact' ? '#contact' : '#'} 
                                        className="relative text-gray-600 font-medium transition-all duration-300 hover:text-blue-600 py-2 group cursor-none"
                                    >
                                        {item}
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                                    </a>
                                </li>
                            ))}
                            <li>
                                {auth.isAuthenticated ? (
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-700">Hi, {auth.user?.profile.preferred_username || "User"}</span>
                                        <button 
                                            onClick={() => auth.signoutRedirect()}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => auth.signinRedirect()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                                    >
                                        Login
                                    </button>
                                )}
                            </li>
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-gray-600 focus:outline-none cursor-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
                        {['Features', 'Events', 'Contact'].map((item) => (
                            <a 
                                key={item}
                                href={item === 'Contact' ? '#contact' : '#'} 
                                className="text-gray-600 font-medium hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        {auth.isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 text-sm text-gray-500">Signed in as {auth.user?.profile.email}</div>
                                <button 
                                    onClick={() => auth.signoutRedirect()}
                                    className="text-left w-full text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => auth.signinRedirect()}
                                className="text-left w-full text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                Login
                            </button>
                        )}
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <main className="flex-grow pt-24">
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            Event Management <span className="text-blue-600">Made Simple</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            The easiest way to plan, organize, and execute your events. Focus on creating memorable experiences, not managing spreadsheets.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition cursor-none">
                                Get Started
                            </button>
                            <button className="px-8 py-3 bg-gray-100 text-gray-800 rounded-full font-semibold hover:bg-gray-200 transition cursor-none">
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-16">Why Choose EventMento?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-blue-50/60 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-blue-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 text-blue-600 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Easy Scheduling</h3>
                                <p className="text-gray-600">Streamline your timeline with our intuitive drag-and-drop calendar interface.</p>
                            </div>
                            {/* Feature 2 */}
                            <div className="bg-blue-50/60 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-blue-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 text-purple-600 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Attendee Management</h3>
                                <p className="text-gray-600">Keep track of RSVPs, ticket sales, and guest preferences all in one place.</p>
                            </div>
                            {/* Feature 3 */}
                            <div className="bg-blue-50/60 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-blue-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 text-green-600 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                                <p className="text-gray-600">Get insights into your event performance with detailed, real-time reports.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upcoming Events Section */}
                <section id="events" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
                            <p className="text-gray-600">Join us at our next gathering.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Event Card 1 */}
                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group">
                                <div className="h-48 bg-blue-100 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Conference</span>
                                     </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-blue-600 text-sm font-semibold mb-1">Mar 15, 2025</p>
                                            <h3 className="text-xl font-bold group-hover:text-blue-600 transition">Tech Summit 2025</h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-2">The biggest tech conference of the year featuring industry leaders.</p>
                                    <div className="flex items-center text-gray-500 text-sm">
                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                         San Francisco, CA
                                    </div>
                                </div>
                            </div>

                            {/* Event Card 2 */}
                             <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group">
                                <div className="h-48 bg-purple-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">Workshop</span>
                                     </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-purple-600 text-sm font-semibold mb-1">Apr 02, 2025</p>
                                            <h3 className="text-xl font-bold group-hover:text-purple-600 transition">Design Masterclass</h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-2">Learn advanced design principles from top designers.</p>
                                    <div className="flex items-center text-gray-500 text-sm">
                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                         New York, NY
                                    </div>
                                </div>
                            </div>

                            {/* Event Card 3 */}
                             <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group">
                                <div className="h-48 bg-green-100 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                                        <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Networking</span>
                                     </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-green-600 text-sm font-semibold mb-1">Apr 20, 2025</p>
                                            <h3 className="text-xl font-bold group-hover:text-green-600 transition">Startup Mixer</h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-2">Connect with founders, investors, and fellow entrepreneurs.</p>
                                    <div className="flex items-center text-gray-500 text-sm">
                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                         Austin, TX
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
                        </div>
                        <div className="bg-blue-50/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-sm border border-blue-100">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition cursor-none" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition cursor-none" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition cursor-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition w-full md:w-auto cursor-none">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <div className="text-2xl font-bold tracking-tight text-white mb-6">EventMento</div>
                            <p className="text-gray-400 leading-relaxed">
                                Making event management effortless for organizers and memorable for attendees.
                            </p>
                        </div>
                        {/* Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-white transition cursor-none">Home</a></li>
                                <li><a href="#" className="hover:text-white transition cursor-none">Features</a></li>
                                <li><a href="#events" className="hover:text-white transition cursor-none">Events</a></li>
                                <li><a href="#contact" className="hover:text-white transition cursor-none">Contact</a></li>
                            </ul>
                        </div>
                        {/* Resources */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-white transition cursor-none">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition cursor-none">API Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition cursor-none">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition cursor-none">Terms of Service</a></li>
                            </ul>
                        </div>
                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li>hello@eventmento.com</li>
                                <li>+1 (555) 123-4567</li>
                                <li className="pt-4 flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-white transition cursor-none">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition cursor-none">
                                        <span className="sr-only">GitHub</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center bg-gray-900">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} EventMento. All rights reserved.</p>
                        <div className="flex space-x-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-white transition cursor-none">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition cursor-none">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Main;
