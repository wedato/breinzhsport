"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { FiFilter } from "react-icons/fi";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/products/search?q=${encodeURIComponent(
            query || ""
          )}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la recherche des produits");
        }
        const data = await response.json();
        setProducts(data);

        // Extraire les catégories uniques
        const uniqueCategories = Array.from(
          new Set(
            data.map((product: Product) => product.category).filter(Boolean)
          )
        );
        setCategories(uniqueCategories as string[]);

        // Trouver le prix maximum pour le filtre
        const maxPrice = Math.max(
          ...data.map((product: Product) => {
            const price =
              typeof product.price === "string"
                ? parseFloat(product.price)
                : product.price;
            return !isNaN(price) ? price : 0;
          })
        );
        setPriceRange([0, Math.ceil(maxPrice)]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const filteredProducts = products.filter((product) => {
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price;
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesPrice =
      !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres */}
          <aside className="w-full md:w-64 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiFilter />
                Filtres
              </h2>

              {/* Filtre par catégorie */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Catégorie</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par prix */}
              <div>
                <h3 className="font-medium mb-2">Prix</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]}€</span>
                    <span>{priceRange[1]}€</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Résultats */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {query ? `Résultats pour "${query}"` : "Tous les produits"}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} produit
                {filteredProducts.length > 1 ? "s" : ""} trouvé
                {filteredProducts.length > 1 ? "s" : ""}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Aucun produit ne correspond à vos critères
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
