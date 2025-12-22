'use client';

import { useLocale } from 'next-intl';

export default function AboutPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'À propos de Nature Pharmacy',
      subtitle: 'Votre partenaire de confiance pour les produits naturels au Sénégal',
      mission: {
        title: 'Notre Mission',
        text: 'Nature Pharmacy s\'engage à rendre les produits naturels et biologiques accessibles à tous au Sénégal. Nous croyons au pouvoir de la nature pour améliorer la santé et le bien-être de nos clients.',
      },
      vision: {
        title: 'Notre Vision',
        text: 'Devenir la marketplace leader en Afrique de l\'Ouest pour les produits naturels, biologiques et durables, tout en soutenant les producteurs locaux et en promouvant un mode de vie sain.',
      },
      values: {
        title: 'Nos Valeurs',
        items: [
          { title: 'Authenticité', desc: 'Nous garantissons l\'authenticité de tous nos produits naturels et biologiques.' },
          { title: 'Qualité', desc: 'Chaque produit est soigneusement sélectionné pour sa qualité exceptionnelle.' },
          { title: 'Transparence', desc: 'Nous croyons en une communication honnête avec nos clients et nos vendeurs.' },
          { title: 'Durabilité', desc: 'Nous soutenons les pratiques durables et responsables.' },
        ],
      },
      story: {
        title: 'Notre Histoire',
        text: 'Fondée au Sénégal, Nature Pharmacy est née de la passion pour les remèdes naturels et la médecine traditionnelle africaine. Notre plateforme connecte les producteurs locaux avec les consommateurs qui recherchent des alternatives naturelles pour leur santé et leur bien-être.',
      },
    },
    en: {
      title: 'About Nature Pharmacy',
      subtitle: 'Your trusted partner for natural products in Senegal',
      mission: {
        title: 'Our Mission',
        text: 'Nature Pharmacy is committed to making natural and organic products accessible to everyone in Senegal. We believe in the power of nature to improve the health and well-being of our customers.',
      },
      vision: {
        title: 'Our Vision',
        text: 'To become the leading marketplace in West Africa for natural, organic, and sustainable products, while supporting local producers and promoting a healthy lifestyle.',
      },
      values: {
        title: 'Our Values',
        items: [
          { title: 'Authenticity', desc: 'We guarantee the authenticity of all our natural and organic products.' },
          { title: 'Quality', desc: 'Each product is carefully selected for its exceptional quality.' },
          { title: 'Transparency', desc: 'We believe in honest communication with our customers and sellers.' },
          { title: 'Sustainability', desc: 'We support sustainable and responsible practices.' },
        ],
      },
      story: {
        title: 'Our Story',
        text: 'Founded in Senegal, Nature Pharmacy was born from a passion for natural remedies and traditional African medicine. Our platform connects local producers with consumers seeking natural alternatives for their health and wellness.',
      },
    },
    es: {
      title: 'Acerca de Nature Pharmacy',
      subtitle: 'Su socio de confianza para productos naturales en Senegal',
      mission: {
        title: 'Nuestra Misión',
        text: 'Nature Pharmacy se compromete a hacer que los productos naturales y orgánicos sean accesibles para todos en Senegal. Creemos en el poder de la naturaleza para mejorar la salud y el bienestar de nuestros clientes.',
      },
      vision: {
        title: 'Nuestra Visión',
        text: 'Convertirse en el mercado líder en África Occidental para productos naturales, orgánicos y sostenibles, mientras apoyamos a los productores locales y promovemos un estilo de vida saludable.',
      },
      values: {
        title: 'Nuestros Valores',
        items: [
          { title: 'Autenticidad', desc: 'Garantizamos la autenticidad de todos nuestros productos naturales y orgánicos.' },
          { title: 'Calidad', desc: 'Cada producto es cuidadosamente seleccionado por su calidad excepcional.' },
          { title: 'Transparencia', desc: 'Creemos en la comunicación honesta con nuestros clientes y vendedores.' },
          { title: 'Sostenibilidad', desc: 'Apoyamos prácticas sostenibles y responsables.' },
        ],
      },
      story: {
        title: 'Nuestra Historia',
        text: 'Fundada en Senegal, Nature Pharmacy nació de la pasión por los remedios naturales y la medicina tradicional africana. Nuestra plataforma conecta a los productores locales con los consumidores que buscan alternativas naturales para su salud y bienestar.',
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
