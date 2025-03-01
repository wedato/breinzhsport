"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { FiTrash2, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string | number;
  name: string;
  price: number | string;
  imageUrl?: string;
  category?: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Charger le panier depuis le localStorage
    try {
      const cartJson = localStorage.getItem("cart");
      if (cartJson) {
        const parsedCart = JSON.parse(cartJson);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculer le sous-total
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  // Calculer les frais de livraison (gratuit si le sous-total est supérieur à 50€)
  const shippingCost = subtotal >= 50 ? 0 : 4.99;

  // Calculer le total
  const total = subtotal + shippingCost;

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Supprimer un produit du panier
  const removeItem = (id: string | number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Vider le panier
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Votre Panier</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-gray-500 mb-4">Votre panier est vide</div>
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiShoppingBag className="mr-2" />
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Votre Panier</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <FiArrowLeft className="mr-2" /> Retour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 bg-gray-50 p-4">
              <div className="md:col-span-2">Produit</div>
              <div className="text-center">Prix</div>
              <div className="text-center">Quantité</div>
              <div className="text-right">Total</div>
            </div>

            {cartItems.map((item) => {
              const itemPrice =
                typeof item.price === "string"
                  ? parseFloat(item.price)
                  : item.price;
              const itemTotal = itemPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="border-t border-gray-200 p-4 md:grid md:grid-cols-5 md:gap-4 md:items-center"
                >
                  {/* Produit (image + nom) */}
                  <div className="flex items-center md:col-span-2 mb-4 md:mb-0">
                    <div className="w-20 h-20 relative flex-shrink-0 mr-4">
                      <ProductImage
                        src={item.imageUrl}
                        alt={item.name}
                        category={item.category}
                        fill
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="text-gray-800 hover:text-blue-600 font-medium"
                      >
                        {item.name}
                      </Link>
                      {item.category && (
                        <div className="text-sm text-gray-500 mt-1">
                          {item.category}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prix unitaire */}
                  <div className="text-gray-800 md:text-center mb-2 md:mb-0">
                    {itemPrice.toFixed(2)} €
                  </div>

                  {/* Quantité */}
                  <div className="flex items-center justify-between md:justify-center mb-2 md:mb-0">
                    <span className="md:hidden text-gray-500">Quantité:</span>
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 border-r hover:bg-gray-100"
                        aria-label="Diminuer la quantité"
                      >
                        -
                      </button>
                      <span className="w-10 text-center py-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 border-l hover:bg-gray-100"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total + bouton supprimer */}
                  <div className="flex items-center justify-between md:justify-end">
                    <span className="md:hidden text-gray-500">Total:</span>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 mr-4">
                        {itemTotal.toFixed(2)} €
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Supprimer"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Vider le panier
              </button>
              <Link
                href="/products"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span>
                  {shippingCost === 0
                    ? "Gratuit"
                    : `${shippingCost.toFixed(2)} €`}
                </span>
              </div>
              {subtotal < 50 && (
                <div className="text-sm text-gray-500 italic">
                  Plus que {(50 - subtotal).toFixed(2)} € pour la livraison
                  gratuite
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center"
            >
              Passer à la commande
            </Link>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Paiement 100% sécurisé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
