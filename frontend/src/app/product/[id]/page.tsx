"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ProductImage } from "@/components/ProductImage";
import {
  FiShoppingCart,
  FiArrowLeft,
  FiCheck,
  FiTruck,
  FiShield,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const unwrappedParams = React.use(params as Promise<{ id: string }>);
  const { id } = unwrappedParams;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Simulation d'un appel API
        // Dans une application réelle, vous feriez un appel à votre API
        // fetch(`/api/products/${id}`)

        // Pour la démonstration, nous allons simuler un délai et récupérer des données fictives
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Données fictives pour la démonstration
        const mockProducts: Product[] = [
          {
            id: "1",
            name: "Ballon de football Pro",
            price: 29.99,
            description:
              "Ballon de football professionnel conçu pour les matchs officiels. Excellente durabilité et précision de tir.",
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
              "Chaussures de football haut de gamme avec crampons pour une adhérence optimale sur terrain naturel.",
            category: "Football",
            brand: "Adidas",
            stock: 8,
            imageUrl: "chaussures-predator.jpg",
            isActive: true,
          },
          {
            id: "3",
            name: "Maillot de l'équipe de France",
            price: 79.99,
            description:
              "Maillot officiel de l'équipe de France de football, collection 2023.",
            category: "Football",
            brand: "Nike",
            stock: 20,
            imageUrl: "maillot-france.jpg",
            isActive: true,
          },
        ];

        const foundProduct = mockProducts.find((p) => p.id === id);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Produit non trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement du produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Récupérer le panier actuel du localStorage
    const cartJson = localStorage.getItem("cart");
    const cart = cartJson ? JSON.parse(cartJson) : [];

    // Définir un type pour les éléments du panier
    interface CartItem {
      id: string | number;
      name: string;
      price: number | string;
      imageUrl?: string;
      category?: string;
      quantity: number;
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cart.findIndex(
      (item: CartItem) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité si le produit existe déjà
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter le nouveau produit au panier
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: quantity,
      });
    }

    // Sauvegarder le panier mis à jour
    localStorage.setItem("cart", JSON.stringify(cart));

    // Afficher le message de confirmation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error || "Produit non trouvé"}</p>
          <Link
            href="/products"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bouton retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Retour
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image du produit */}
        <div className="aspect-square relative rounded-lg overflow-hidden h-[500px]">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            category={product.category}
            fill
            className="object-cover"
          />
        </div>

        {/* Informations du produit */}
        <div>
          {/* Catégorie et marque */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link
              href={`/category/${product.category?.toLowerCase()}`}
              className="hover:text-blue-600"
            >
              {product.category}
            </Link>
            {product.brand && (
              <>
                <span className="mx-2">•</span>
                <span>{product.brand}</span>
              </>
            )}
          </div>

          {/* Nom du produit */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Prix */}
          <div className="text-2xl font-bold text-gray-900 mb-6">
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : parseFloat(product.price).toFixed(2)}{" "}
            €
          </div>

          {/* Description */}
          <div className="prose prose-sm mb-6">
            <p>{product.description}</p>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock && product.stock > 0 ? (
              <div className="flex items-center text-green-600">
                <FiCheck className="mr-2" />
                {product.stock > 10
                  ? "En stock"
                  : `Plus que ${product.stock} en stock`}
              </div>
            ) : (
              <div className="text-red-600">Rupture de stock</div>
            )}
          </div>

          {/* Sélection de quantité et ajout au panier */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="w-full sm:w-1/3">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantité
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(product.stock || 0, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                &nbsp;
              </label>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center py-2 px-4 rounded-md ${
                  product.stock === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FiShoppingCart className="mr-2" />
                {addedToCart ? "Ajouté au panier !" : "Ajouter au panier"}
              </button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiTruck className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Livraison
                  </h3>
                  <p className="text-sm text-gray-500">
                    Livraison gratuite à partir de 50€
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiShield className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Garantie
                  </h3>
                  <p className="text-sm text-gray-500">
                    Garantie 2 ans sur tous nos produits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
