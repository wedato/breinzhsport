"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiUser,
  FiPackage,
  FiMapPin,
  FiHeart,
  FiLogOut,
  FiEdit2,
  FiEye,
  FiChevronRight,
} from "react-icons/fi";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    const fetchUserData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Données fictives pour la démonstration
        const mockUser: User = {
          id: "user123",
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@example.com",
          phone: "06 12 34 56 78",
        };

        const mockOrders: Order[] = [
          {
            id: "ORD-2023-001",
            date: "2023-11-15",
            status: "Livré",
            total: 129.97,
            items: 3,
          },
          {
            id: "ORD-2023-002",
            date: "2023-12-02",
            status: "En cours de livraison",
            total: 49.99,
            items: 1,
          },
          {
            id: "ORD-2024-001",
            date: "2024-01-10",
            status: "En préparation",
            total: 89.98,
            items: 2,
          },
        ];

        const mockAddresses: Address[] = [
          {
            id: "addr1",
            type: "Domicile",
            street: "123 Rue de la Paix",
            city: "Paris",
            postalCode: "75001",
            country: "France",
            isDefault: true,
          },
          {
            id: "addr2",
            type: "Travail",
            street: "45 Avenue des Champs-Élysées",
            city: "Paris",
            postalCode: "75008",
            country: "France",
            isDefault: false,
          },
        ];

        setUser(mockUser);
        setOrders(mockOrders);
        setAddresses(mockAddresses);
        setFormData({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          phone: mockUser.phone || "",
        });
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler la mise à jour des données utilisateur
    if (user) {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      };
      setUser(updatedUser);
      setIsEditing(false);

      // Dans une application réelle, vous enverriez ces données à votre API
      console.log("Données utilisateur mises à jour:", updatedUser);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livré":
        return "bg-green-100 text-green-800";
      case "En cours de livraison":
        return "bg-blue-100 text-blue-800";
      case "En préparation":
        return "bg-yellow-100 text-yellow-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="md:col-span-3">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <Link
            href="/login"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Compte</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar de navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3 p-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiUser size={20} />
            </div>
            <div>
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-3 p-3 rounded-md ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiUser size={18} />
              <span>Profil</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center space-x-3 p-3 rounded-md ${
                activeTab === "orders"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiPackage size={18} />
              <span>Commandes</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center space-x-3 p-3 rounded-md ${
                activeTab === "addresses"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiMapPin size={18} />
              <span>Adresses</span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center space-x-3 p-3 rounded-md ${
                activeTab === "wishlist"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiHeart size={18} />
              <span>Liste de souhaits</span>
            </button>

            <Link
              href="/logout"
              className="w-full flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <FiLogOut size={18} />
              <span>Déconnexion</span>
            </Link>
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profil */}
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Informations personnelles
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FiEdit2 className="mr-1" size={16} />
                      Modifier
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nom
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            phone: user.phone || "",
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Prénom</div>
                        <div>{user.firstName}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Nom</div>
                        <div>{user.lastName}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div>{user.email}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Téléphone</div>
                        <div>{user.phone || "Non renseigné"}</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-3">Sécurité</h3>
                      <Link
                        href="/account/change-password"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Changer mon mot de passe
                        <FiChevronRight className="ml-1" size={16} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Commandes */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Mes commandes</h2>

                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Vous n'avez pas encore passé de commande.
                    </p>
                    <Link
                      href="/products"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Découvrir nos produits
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex flex-wrap justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">
                              Commande #{order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(order.date)} • {order.items} article
                              {order.items > 1 ? "s" : ""}
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="font-medium">
                            {order.total.toFixed(2)} €
                          </div>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FiEye className="mr-1" size={16} />
                            Voir les détails
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Adresses */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Mes adresses</h2>
                  <Link
                    href="/account/addresses/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Ajouter une adresse
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Vous n'avez pas encore enregistré d'adresse.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="border border-gray-200 rounded-lg p-4 relative"
                      >
                        {address.isDefault && (
                          <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Par défaut
                          </div>
                        )}

                        <div className="font-medium mb-1">{address.type}</div>
                        <div className="text-sm text-gray-600 mb-3">
                          <div>{address.street}</div>
                          <div>
                            {address.postalCode} {address.city}
                          </div>
                          <div>{address.country}</div>
                        </div>

                        <div className="flex space-x-2 mt-2">
                          <Link
                            href={`/account/addresses/${address.id}/edit`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Modifier
                          </Link>
                          {!address.isDefault && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                className="text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                  // Simuler la définition comme adresse par défaut
                                  const updatedAddresses = addresses.map(
                                    (a) => ({
                                      ...a,
                                      isDefault: a.id === address.id,
                                    })
                                  );
                                  setAddresses(updatedAddresses);
                                }}
                              >
                                Définir par défaut
                              </button>
                            </>
                          )}
                          {!address.isDefault && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                className="text-sm text-red-600 hover:text-red-800"
                                onClick={() => {
                                  // Simuler la suppression d'une adresse
                                  setAddresses(
                                    addresses.filter((a) => a.id !== address.id)
                                  );
                                }}
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Liste de souhaits */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  Ma liste de souhaits
                </h2>

                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Votre liste de souhaits est vide.
                  </p>
                  <Link
                    href="/products"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Découvrir nos produits
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
