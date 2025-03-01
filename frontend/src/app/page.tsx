"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Product } from "@/types/product";
import {
  FiArrowRight,
  FiChevronRight,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des produits en vedette
    const fetchFeaturedProducts = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Données fictives pour la démonstration
        const mockProducts: Product[] = [
          {
            id: "1",
            name: "Ballon de football Pro",
            price: 29.99,
            description:
              "Ballon de football professionnel conçu pour les matchs officiels.",
            category: "Football",
            brand: "Nike",
            stock: 15,
            imageUrl: "ballon-football-pro.jpg",
            isActive: true,
          },
          {
            id: "2",
            name: "Chaussures de football Predator",
            price: 89.99,
            description:
              "Chaussures de football haut de gamme avec crampons pour une adhérence optimale.",
            category: "Football",
            brand: "Adidas",
            stock: 8,
            imageUrl: "chaussures-predator.jpg",
            isActive: true,
          },
          {
            id: "3",
            name: "Ballon de basketball NBA",
            price: 39.99,
            description:
              "Ballon de basketball officiel de la NBA pour les joueurs exigeants.",
            category: "Basketball",
            brand: "Spalding",
            stock: 12,
            imageUrl: "ballon-nba.jpg",
            isActive: true,
          },
          {
            id: "4",
            name: "Raquette de tennis Pro",
            price: 129.99,
            description:
              "Raquette de tennis professionnelle pour un contrôle et une puissance optimaux.",
            category: "Tennis",
            brand: "Wilson",
            stock: 5,
            imageUrl: "raquette-tennis.jpg",
            isActive: true,
          },
        ];

        setFeaturedProducts(mockProducts);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des produits en vedette:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Catégories populaires
  const categories = [
    {
      name: "Football",
      image: "/images/products/ballon-football-pro.jpg",
      slug: "football",
    },
    {
      name: "Basketball",
      image: "/images/products/ballon-nba.jpg",
      slug: "basketball",
    },
    {
      name: "Tennis",
      image: "/images/products/raquette-tennis.jpg",
      slug: "tennis",
    },
    {
      name: "Running",
      image: "/images/products/chaussures-running.jpg",
      slug: "running",
    },
    {
      name: "Fitness",
      image: "/images/products/tapis-yoga.jpg",
      slug: "fitness",
    },
    {
      name: "Boxe",
      image: "/images/products/gants-boxe.jpg",
      slug: "boxe",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Équipements sportifs de qualité pour tous les passionnés
              </h1>
              <p className="text-lg mb-8 text-blue-100">
                Découvrez notre sélection d&apos;équipements sportifs haut de
                gamme pour améliorer vos performances et votre confort.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center"
                >
                  <FiShoppingBag className="mr-2" />
                  Voir tous les produits
                </Link>
                <Link
                  href="/category/football"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
                >
                  Produits populaires
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-96">
              <ProductImage
                src=""
                alt="Équipements sportifs"
                category="football"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

        {/* Vague décorative en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Catégories populaires
            </h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              Voir tout <FiArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative mb-2">
                  <ProductImage
                    src={category.image}
                    alt={category.name}
                    category={category.name.toLowerCase()}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-center font-medium group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Produits en vedette
            </h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              Voir tout <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bannière promotionnelle */}
      <section className="py-12 md:py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Offre spéciale
              </h2>
              <p className="text-lg mb-6 text-blue-100">
                Profitez de 20% de réduction sur tous les articles de football
                jusqu&apos;au 30 juin.
              </p>
              <Link
                href="/category/football"
                className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
              >
                En profiter maintenant <FiChevronRight className="ml-2" />
              </Link>
            </div>
            <div className="relative h-64">
              <ProductImage
                src=""
                alt="Promotion football"
                category="football"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <FiTruck size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Livraison gratuite</h3>
              <p className="text-gray-600">
                Livraison gratuite à partir de 50€ d&apos;achat sur toute la
                France métropolitaine.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <FiShield size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Garantie 2 ans</h3>
              <p className="text-gray-600">
                Tous nos produits sont garantis 2 ans pour vous assurer une
                tranquillité d&apos;esprit.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <FiRefreshCw size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Retours gratuits</h3>
              <p className="text-gray-600">
                Retours gratuits sous 30 jours si vous n&apos;êtes pas satisfait
                de votre achat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Ce que disent nos clients
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;Les chaussures de football que j&apos;ai achetées sont
                parfaites. Très confortables et d&apos;excellente qualité. Je
                recommande vivement !&rdquo;
              </p>
              <div className="font-medium">Thomas D.</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;Livraison rapide et service client très réactif. Les
                produits sont conformes à la description et de très bonne
                qualité.&rdquo;
              </p>
              <div className="font-medium">Sophie M.</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar />
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;J&apos;ai acheté plusieurs équipements de fitness et je
                suis très satisfait. Le rapport qualité-prix est
                excellent.&rdquo;
              </p>
              <div className="font-medium">Pierre L.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-blue-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prêt à améliorer vos performances ?
          </h2>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
            Découvrez notre gamme complète d&apos;équipements sportifs et
            trouvez les produits qui vous aideront à atteindre vos objectifs.
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-700 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            <FiShoppingBag className="mr-2" />
            Découvrir nos produits
          </Link>
        </div>
      </section>
    </div>
  );
}
