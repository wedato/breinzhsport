import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              BreizhSport
            </Link>
            <p className="mt-4 text-gray-400">
              Votre partenaire pour tous vos besoins en équipements sportifs.
              Qualité, performance et passion du sport.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/football"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Football
                </Link>
              </li>
              <li>
                <Link
                  href="/category/basketball"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Basketball
                </Link>
              </li>
              <li>
                <Link
                  href="/category/tennis"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tennis
                </Link>
              </li>
              <li>
                <Link
                  href="/category/running"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Running
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fitness"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Fitness
                </Link>
              </li>
              <li>
                <Link
                  href="/category/boxe"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Boxe
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/livraison"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link
                  href="/retours"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Retours et remboursements
                </Link>
              </li>
            </ul>
          </div>

          {/* Mon compte */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mon compte</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Se connecter
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mon profil
                </Link>
              </li>
              <li>
                <Link
                  href="/account?tab=orders"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mon panier
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Paiement et newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Moyens de paiement</h3>
            <div className="flex space-x-4">
              <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium">
                Visa
              </div>
              <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium">
                Mastercard
              </div>
              <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium">
                PayPal
              </div>
              <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium">
                Apple Pay
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-2">
              Inscrivez-vous pour recevoir nos offres et nouveautés
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Copyright et mentions légales */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} BreizhSport. Tous droits réservés.
          </div>
          <div className="flex flex-wrap justify-center space-x-4 text-sm">
            <Link
              href="/mentions-legales"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/cgv"
              className="text-gray-400 hover:text-white transition-colors"
            >
              CGV
            </Link>
            <Link
              href="/confidentialite"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Gestion des cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
