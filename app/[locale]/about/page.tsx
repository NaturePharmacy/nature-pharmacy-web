'use client';

import { useLocale } from 'next-intl';

export default function AboutPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'À propos de Nature Pharmacy',
      subtitle: 'Votre marketplace internationale de produits naturels',
      mission: {
        title: 'Notre Mission',
        text: 'Nature Pharmacy est une marketplace qui connecte vendeurs et acheteurs de produits naturels partout dans le monde. Nous facilitons l\'accès aux remèdes traditionnels et aux produits biologiques, permettant aux vendeurs indépendants de proposer leurs produits à une clientèle internationale.',
      },
      vision: {
        title: 'Notre Vision',
        text: 'Devenir la marketplace de référence mondiale pour les produits naturels, biologiques et durables, en connectant des vendeurs et acheteurs du monde entier tout en promouvant un mode de vie sain.',
      },
      values: {
        title: 'Nos Valeurs',
        items: [
          { title: 'Connexion', desc: 'Nous connectons vendeurs et acheteurs du monde entier autour des produits naturels.' },
          { title: 'Transparence', desc: 'Nous croyons en une communication honnête entre notre plateforme, les vendeurs et les acheteurs.' },
          { title: 'Diversité', desc: 'Nous valorisons la richesse des traditions et remèdes naturels de toutes les cultures.' },
          { title: 'Accessibilité', desc: 'Nous rendons les produits naturels accessibles partout dans le monde.' },
        ],
      },
      story: {
        title: 'Notre Histoire',
        text: 'Nature Pharmacy est née de la volonté de créer un pont entre les producteurs de produits naturels et les consommateurs du monde entier. Notre plateforme permet à chaque vendeur de proposer ses produits à une clientèle internationale, et à chaque acheteur de découvrir des remèdes traditionnels de toutes les cultures.',
      },
    },
    en: {
      title: 'About Nature Pharmacy',
      subtitle: 'Your international marketplace for natural products',
      mission: {
        title: 'Our Mission',
        text: 'Nature Pharmacy is a marketplace that connects sellers and buyers of natural products worldwide. We facilitate access to traditional remedies and organic products, allowing independent sellers to offer their products to an international clientele.',
      },
      vision: {
        title: 'Our Vision',
        text: 'To become the world\'s leading marketplace for natural, organic, and sustainable products, connecting sellers and buyers worldwide while promoting a healthy lifestyle.',
      },
      values: {
        title: 'Our Values',
        items: [
          { title: 'Connection', desc: 'We connect sellers and buyers worldwide around natural products.' },
          { title: 'Transparency', desc: 'We believe in honest communication between our platform, sellers and buyers.' },
          { title: 'Diversity', desc: 'We value the richness of natural traditions and remedies from all cultures.' },
          { title: 'Accessibility', desc: 'We make natural products accessible everywhere in the world.' },
        ],
      },
      story: {
        title: 'Our Story',
        text: 'Nature Pharmacy was born from the desire to create a bridge between natural product producers and consumers worldwide. Our platform allows every seller to offer their products to an international clientele, and every buyer to discover traditional remedies from all cultures.',
      },
    },
    es: {
      title: 'Acerca de Nature Pharmacy',
      subtitle: 'Tu marketplace internacional de productos naturales',
      mission: {
        title: 'Nuestra Misión',
        text: 'Nature Pharmacy es un marketplace que conecta vendedores y compradores de productos naturales en todo el mundo. Facilitamos el acceso a remedios tradicionales y productos orgánicos, permitiendo a vendedores independientes ofrecer sus productos a una clientela internacional.',
      },
      vision: {
        title: 'Nuestra Visión',
        text: 'Convertirnos en el marketplace líder mundial para productos naturales, orgánicos y sostenibles, conectando vendedores y compradores de todo el mundo mientras promovemos un estilo de vida saludable.',
      },
      values: {
        title: 'Nuestros Valores',
        items: [
          { title: 'Conexión', desc: 'Conectamos vendedores y compradores de todo el mundo en torno a productos naturales.' },
          { title: 'Transparencia', desc: 'Creemos en la comunicación honesta entre nuestra plataforma, vendedores y compradores.' },
          { title: 'Diversidad', desc: 'Valoramos la riqueza de las tradiciones y remedios naturales de todas las culturas.' },
          { title: 'Accesibilidad', desc: 'Hacemos que los productos naturales sean accesibles en todo el mundo.' },
        ],
      },
      story: {
        title: 'Nuestra Historia',
        text: 'Nature Pharmacy nació del deseo de crear un puente entre los productores de productos naturales y los consumidores de todo el mundo. Nuestra plataforma permite a cada vendedor ofrecer sus productos a una clientela internacional, y a cada comprador descubrir remedios tradicionales de todas las culturas.',
      },
    },
  };

  const t = content[locale] || content.fr;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.mission.title}</h2>
              <p className="text-gray-600 leading-relaxed">{t.mission.text}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.vision.title}</h2>
              <p className="text-gray-600 leading-relaxed">{t.vision.text}</p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.values.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.values.items.map((value, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Story */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t.story.title}</h2>
            <p className="leading-relaxed text-green-50">{t.story.text}</p>
          </div>
        </div>
      </main>

          </div>
  );
}
