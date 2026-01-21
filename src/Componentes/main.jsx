import React from 'react';

const Main = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
            {/* Header */}
            <header className="border-b border-gray-100 py-6">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="text-2xl font-bold tracking-tight text-blue-600">EventMento</div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Features</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            Event Management <span className="text-blue-600">Made Simple</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            The easiest way to plan, organize, and execute your events. Focus on creating memorable experiences, not managing spreadsheets.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
                                Get Started
                            </button>
                            <button className="px-8 py-3 bg-gray-100 text-gray-800 rounded-full font-semibold hover:bg-gray-200 transition">
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
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Easy Scheduling</h3>
                                <p className="text-gray-600">Streamline your timeline with our intuitive drag-and-drop calendar interface.</p>
                            </div>
                            {/* Feature 2 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Attendee Management</h3>
                                <p className="text-gray-600">Keep track of RSVPs, ticket sales, and guest preferences all in one place.</p>
                            </div>
                            {/* Feature 3 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                                <p className="text-gray-600">Get insights into your event performance with detailed, real-time reports.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} EventMento. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Main;