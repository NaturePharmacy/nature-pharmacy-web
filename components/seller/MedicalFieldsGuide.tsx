'use client';

import { useState } from 'react';

export default function MedicalFieldsGuide() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Guide de remplissage
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-300 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Guide de Remplissage - Médecine Traditionnelle
            </h3>
            <p className="text-sm text-gray-600">
              Conseils pour bien documenter vos remèdes naturels
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4 text-sm">
        {/* Catégorie Thérapeutique */}
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">📋</span>
            Catégorie Thérapeutique
          </h4>
          <p className="text-gray-700 mb-2">
            Sélectionnez le système du corps ciblé par votre produit.
          </p>
          <div className="bg-blue-50 p-2 rounded text-xs">
            <strong>Exemple:</strong> Moringa → Système immunitaire / Gingembre → Système digestif
          </div>
        </div>

        {/* Indications */}
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-green-600">✅</span>
            Indications Thérapeutiques
          </h4>
          <p className="text-gray-700 mb-2">
            Listez les problèmes de santé que votre produit peut aider à traiter.
          </p>
          <div className="bg-green-50 p-2 rounded text-xs space-y-1">
            <strong>Exemples:</strong>
            <ul className="list-disc list-inside">
              <li>Maux de tête</li>
              <li>Digestion difficile</li>
              <li>Fatigue chronique</li>
            </ul>
          </div>
        </div>

        {/* Utilisation Traditionnelle */}
        <div className="bg-white p-4 rounded-lg border border-amber-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-amber-600">🌿</span>
            Utilisation Traditionnelle
          </h4>
          <p className="text-gray-700 mb-2">
            Décrivez comment cette plante est utilisée dans la médecine traditionnelle.
          </p>
          <div className="bg-amber-50 p-2 rounded text-xs">
            <strong>Exemple:</strong> "Utilisé depuis des générations en Casamance pour purifier le sang et renforcer le système immunitaire."
          </div>
        </div>

        {/* Posologie */}
        <div className="bg-white p-4 rounded-lg border border-purple-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-purple-600">💊</span>
            Posologie Recommandée
          </h4>
          <p className="text-gray-700 mb-2">
            Indiquez la quantité et la fréquence d'utilisation.
          </p>
          <div className="bg-purple-50 p-2 rounded text-xs space-y-1">
            <strong>Exemples:</strong>
            <ul className="list-disc list-inside">
              <li>Poudre: 1 cuillère à café 2 fois par jour</li>
              <li>Tisane: 1 tasse matin et soir</li>
              <li>Gélules: 2 gélules 3 fois par jour</li>
            </ul>
          </div>
        </div>

        {/* Méthode de Préparation */}
        <div className="bg-white p-4 rounded-lg border border-indigo-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-indigo-600">🔥</span>
            Méthode de Préparation
          </h4>
          <p className="text-gray-700 mb-2">
            Expliquez comment préparer le remède.
          </p>
          <div className="bg-indigo-50 p-2 rounded text-xs space-y-1">
            <strong>Exemples:</strong>
            <ul className="list-disc list-inside">
              <li>Faire bouillir 1L d'eau, ajouter 2 cuillères à soupe, infuser 10 minutes</li>
              <li>Mélanger 1 cuillère dans du jus ou de l'eau tiède</li>
              <li>Appliquer directement sur la peau 2 fois par jour</li>
            </ul>
          </div>
        </div>

        {/* Contre-indications */}
        <div className="bg-white p-4 rounded-lg border border-red-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            Contre-indications (IMPORTANT!)
          </h4>
          <p className="text-gray-700 mb-2">
            Listez les situations où le produit NE DOIT PAS être utilisé.
          </p>
          <div className="bg-red-50 p-2 rounded text-xs space-y-1">
            <strong>Exemples courants:</strong>
            <ul className="list-disc list-inside text-red-800">
              <li>Allergie connue à la plante</li>
              <li>Traitement anticoagulant</li>
              <li>Hypertension artérielle</li>
              <li>Problèmes rénaux ou hépatiques</li>
            </ul>
          </div>
        </div>

        {/* Avertissements */}
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-orange-600">🚨</span>
            Avertissements de Sécurité
          </h4>
          <p className="text-gray-700 mb-2">
            Cochez si votre produit est déconseillé pour certaines personnes.
          </p>
          <div className="bg-orange-50 p-2 rounded text-xs">
            <strong>Important:</strong> Ces informations protègent vos clients et votre responsabilité légale.
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded">
          <p className="text-xs text-gray-800">
            <strong>⚖️ Mention Légale:</strong> Les informations fournies le sont à titre informatif uniquement et ne remplacent pas un avis médical professionnel. Consultez toujours un professionnel de santé avant d'utiliser des remèdes traditionnels, surtout en cas de grossesse, allaitement, ou traitement médical en cours.
          </p>
        </div>
      </div>
    </div>
  );
}
