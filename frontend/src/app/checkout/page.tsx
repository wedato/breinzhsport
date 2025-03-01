"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiCreditCard } from "react-icons/fi";
import Image from "next/image";
import { FiCheck, FiTruck, FiPackage } from "react-icons/fi";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Address {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface PaymentMethod {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address>({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "France",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Charger le panier depuis le localStorage
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 4.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentMethod((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo(0, 0);

    // Simuler une commande réussie
    setTimeout(() => {
      setOrderComplete(true);
      setOrderId(`ORD-${Math.floor(Math.random() * 1000000)}`);
      // Vider le panier
      localStorage.removeItem("cart");
      setCartItems([]);
    }, 2000);
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500 mb-4 text-lg">
            Votre panier est vide
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Continuer mes achats
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

        {/* Étapes de commande */}
        {!orderComplete && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 1 ? <FiCheck size={20} /> : <FiTruck size={20} />}
                </div>
                <span className="text-sm mt-2">Livraison</span>
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  step >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 2 ? (
                    <FiCheck size={20} />
                  ) : (
                    <FiCreditCard size={20} />
                  )}
                </div>
                <span className="text-sm mt-2">Paiement</span>
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  step >= 3 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <FiPackage size={20} />
                </div>
                <span className="text-sm mt-2">Confirmation</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            {/* Étape 1: Adresse de livraison */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Adresse de livraison
                </h2>
                <form onSubmit={handleSubmitAddress} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ville
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Code postal
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pays
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={address.country}
                        onChange={(e) =>
                          setAddress({ ...address, country: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
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
                        value={address.phone}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <Link
                      href="/cart"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiArrowLeft className="mr-2" /> Retour au panier
                    </Link>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continuer vers le paiement
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Étape 2: Paiement */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Méthode de paiement
                </h2>
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentMethod.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cardHolder"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Titulaire de la carte
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      name="cardHolder"
                      value={paymentMethod.cardHolder}
                      onChange={handlePaymentChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date d&apos;expiration
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentMethod.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/AA"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentMethod.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiArrowLeft className="mr-2" /> Retour à la livraison
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Passer la commande
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Étape 3: Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                {!orderComplete ? (
                  <div className="py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg">Traitement de votre commande...</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      Commande confirmée !
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Votre commande #{orderId} a été confirmée et sera expédiée
                      prochainement.
                    </p>
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Détails de livraison</h3>
                      <p className="text-gray-600">
                        {address.fullName}
                        <br />
                        {address.street}
                        <br />
                        {address.postalCode} {address.city}
                        <br />
                        {address.country}
                      </p>
                    </div>
                    <Link
                      href="/"
                      className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continuer mes achats
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Récapitulatif de commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>

              {cartItems.length > 0 && (
                <div className="mb-4 max-h-80 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex py-3 border-b">
                      <div className="h-16 w-16 relative flex-shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          Qté: {item.quantity}
                        </div>
                        <div className="text-sm font-medium mt-1">
                          {(item.price * item.quantity).toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">
                    {calculateSubtotal().toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="font-medium">
                    {calculateShipping() === 0
                      ? "Gratuit"
                      : `${calculateShipping().toFixed(2)} €`}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {step < 3 && (
                <div className="text-xs text-gray-500">
                  <p className="mb-2">
                    En passant votre commande, vous acceptez nos{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Conditions Générales de Vente
                    </Link>
                    .
                  </p>
                  <p>Livraison gratuite à partir de 50€ d&apos;achat.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
