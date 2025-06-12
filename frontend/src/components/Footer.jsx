export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div>
                    <h2 className="text-xl font-bold text-white">AutoBee</h2>
                    <p className="mt-2 text-sm">
                        AutoBee is your intelligent partner in buying, selling, and analyzing cars. Smarter trades start here.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:text-white">About Us</a></li>
                        <li><a href="/" className="hover:text-white">Pricing</a></li>
                        <li><a href="/" className="hover:text-white">Blog</a></li>
                        <li><a href="/" className="hover:text-white">Contact</a></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Services</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:text-white">Car Market Analysis</a></li>
                        <li><a href="/" className="hover:text-white">Smart Trading Tools</a></li>
                        <li><a href="/" className="hover:text-white">Instant Car Valuation</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
                    <form className="flex flex-col space-y-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-3 py-2 bg-gray-800 text-sm rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button className="bg-yellow-500 text-black text-sm py-2 rounded hover:bg-yellow-400">
                            Subscribe
                        </button>
                    </form>
                    <div className="flex space-x-4 mt-4 text-lg">
                        <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="hover:text-white"><i className="fab fa-facebook"></i></a>
                        <a href="#" className="hover:text-white"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm">
                <p>&copy; 2025 AutoBee. All rights reserved.</p>
            </div>
        </footer>
    );
};

