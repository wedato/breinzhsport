"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories] = useState([
    "Football",
    "Basketball",
    "Tennis",
    "Running",
    "Fitness",
    "Boxe",
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Charger le nombre d'articles dans le panier
    const loadCartCount = () => {
      try {
        const cartJson = localStorage.getItem("cart");
        if (cartJson) {
          const cart = JSON.parse(cartJson);
          const count = cart.reduce(
            (total: number, item: { quantity: number }) =>
              total + item.quantity,
            0
          );
          setCartItemsCount(count);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
      }
    };

    loadCartCount();

    // Écouter les changements dans le localStorage pour le panier
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Vérifier le panier toutes les secondes (pour les mises à jour dans le même onglet)
    const interval = setInterval(loadCartCount, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Barre supérieure */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden sm:block">
              Livraison gratuite à partir de 50€
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/account"
                    className="hover:text-blue-200 flex items-center"
                  >
                    <FiUser className="mr-1" /> Mon compte
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-blue-200"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:text-blue-200 flex items-center"
                  >
                    <FiUser className="mr-1" /> Se connecter
                  </Link>
                  <Link href="/register" className="hover:text-blue-200">
                    S&apos;inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Barre principale */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            BreizhSport
          </Link>

          {/* Barre de recherche - cachée sur mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-2xl mx-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Icônes */}
          <div className="flex items-center space-x-6">
            <Link
              href="/cart"
              className="text-gray-600 hover:text-blue-600 relative"
            >
              <FiShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Menu mobile */}
            <button
              className="md:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Navigation des catégories */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <ul
            className={`${
              mobileMenuOpen ? "flex flex-col py-2" : "hidden md:flex"
            } md:space-x-8 md:py-3`}
          >
            {categories.map((category) => (
              <li key={category} className={mobileMenuOpen ? "py-2" : ""}>
                <Link
                  href={`/category/${category.toLowerCase()}`}
                  className={`text-gray-600 hover:text-blue-600 ${
                    pathname === `/category/${category.toLowerCase()}`
                      ? "text-blue-600 font-medium"
                      : ""
                  }`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};
