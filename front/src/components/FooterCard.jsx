import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-[#2a2a2a] text-white text-center py-6 mt-auto">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/contact" className="hover:text-[#9f8b20]">Contact</Link>
                <Link to="/mentions" className="hover:text-[#9f8b20]">Mentions légales</Link>
                <Link to="/politique" className="hover:text-[#9f8b20]">Politique de confidentialité</Link>
            </div>
        </footer>
    );
};
