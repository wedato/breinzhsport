import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const ProductImage = ({
  src,
  alt,
  category,
  fill = false,
  width,
  height,
  className = "",
}: ProductImageProps) => {
  const [error, setError] = useState(false);

  // Images par défaut pour chaque catégorie (utilisant des chemins locaux)
  const defaultImages: Record<string, string> = {
    football: "/images/products/ballon-football-pro.jpg",
    basketball: "/images/products/ballon-nba.jpg",
    tennis: "/images/products/raquette-tennis.jpg",
    running: "/images/products/chaussures-running.jpg",
    fitness: "/images/products/tapis-yoga.jpg",
    boxe: "/images/products/gants-boxe.jpg",
    default: "/images/products/air-jordan.jpg",
  };

  // Déterminer la source de l'image
  const getImageSrc = () => {
    // Si une erreur s'est produite, utiliser l'image par défaut
    if (error) {
      const categoryKey = category?.toLowerCase() || "default";
      return defaultImages[categoryKey] || defaultImages.default;
    }

    // Si l'URL commence par http, c'est une URL externe
    if (src && src.startsWith("http")) {
      return src;
    }

    // Si c'est une image locale avec chemin complet
    if (src && src.startsWith("/")) {
      return src;
    }

    // Si c'est une image locale sans chemin complet, ajouter le préfixe
    if (src) {
      return `/images/products/${src}`;
    }

    // Utiliser l'image par défaut de la catégorie ou l'image par défaut générale
    const categoryKey = category?.toLowerCase() || "default";
    return defaultImages[categoryKey] || defaultImages.default;
  };

  const handleError = () => {
    console.log("Erreur de chargement d'image:", src);
    setError(true);
  };

  if (fill) {
    return (
      <div className={`relative h-64 ${className}`}>
        <Image
          src={getImageSrc()}
          alt={alt}
          fill
          className="object-cover"
          onError={handleError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <Image
      src={getImageSrc()}
      alt={alt}
      width={width || 500}
      height={height || 500}
      className={`object-cover ${className}`}
      onError={handleError}
    />
  );
};
