import { Product } from "@/types/product";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { ProductImage } from "./ProductImage";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [addedToCart, setAddedToCart] = useState(false);

  // Convertir le prix en nombre si ce n'est pas déjà le cas
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation vers la page du produit

    // Récupérer le panier actuel du localStorage
    const cartJson = localStorage.getItem("cart");
    const cart = cartJson ? JSON.parse(cartJson) : [];

    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cart.findIndex(
      (item: { id: string | number }) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité si le produit existe déjà
      cart[existingItemIndex].quantity += 1;
    } else {
      // Ajouter le nouveau produit au panier
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: 1,
      });
    }

    // Sauvegarder le panier mis à jour
    localStorage.setItem("cart", JSON.stringify(cart));

    // Afficher le message de confirmation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/product/${product.id}`}
        className="block aspect-square relative overflow-hidden h-[300px]"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          category={product.category}
          fill
          className="group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock && product.stock < 5 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Plus que {product.stock} en stock
          </span>
        )}

        {addedToCart && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white text-green-600 px-4 py-2 rounded-md font-medium">
              Ajouté au panier !
            </div>
          </div>
        )}
      </Link>

      <div className="p-4">
        <div className="mb-2">
          {product.category && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </span>
          )}
        </div>

        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
        )}

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            {!isNaN(price) ? `${price.toFixed(2)} €` : "Prix non disponible"}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Ajouter au panier"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
