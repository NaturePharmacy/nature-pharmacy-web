'use client';

import { useLocale } from 'next-intl';

export default function CareersPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Carrières',
      subtitle: 'Rejoignez notre équipe et participez à la révolution de la santé naturelle',
      why: {
        title: 'Pourquoi nous rejoindre ?',
        items: [
          {
            title: 'Mission Inspirante',
            description: 'Contribuez à améliorer la santé et le bien-être de milliers de personnes à travers le monde',
          },
          {
            title: 'Innovation',
            description: 'Travaillez avec les dernières technologies dans un environnement dynamique',
          },
          {
            title: 'Croissance',
            description: 'Développez vos compétences avec des formations continues et des opportunités d\'évolution',
          },
          {
            title: 'Impact',
            description: 'Faites partie d\'une entreprise qui valorise la durabilité et l\'authenticité',
          },
        ],
      },
      positions: {
        title: 'Postes ouverts',
        noPositions: 'Aucun poste ouvert actuellement',
        noPositionsDesc: 'Nous n\'avons pas d\'offres d\'emploi pour le moment, mais nous sommes toujours intéressés par les candidatures spontanées.',
      },
      spontaneous: {
        title: 'Candidature spontanée',
        description: 'Vous ne trouvez pas le poste qui vous correspond ? Envoyez-nous votre CV et lettre de motivation.',
        email: 'contact@naturepharmacy.com',
        cta: 'Envoyer votre candidature',
      },
      benefits: {
        title: 'Nos avantages',
        items: [
          'Salaire compétitif',
          'Assurance santé',
          'Formation continue',
          'Environnement de travail moderne',
          'Équilibre vie professionnelle/personnelle',
          'Opportunités d\'évolution',
        ],
      },
    },
    en: {
      title: 'Careers',
      subtitle: 'Join our team and participate in the natural health revolution',
      why: {
        title: 'Why join us?',
        items: [
          {
            title: 'Inspiring Mission',
            description: 'Help improve the health and well-being of thousands of people around the world',
          },
          {
            title: 'Innovation',
            description: 'Work with the latest technologies in a dynamic environment',
          },
          {
            title: 'Growth',
            description: 'Develop your skills with continuous training and advancement opportunities',
          },
          {
            title: 'Impact',
            description: 'Be part of a company that values sustainability and authenticity',
          },
        ],
      },
      positions: {
        title: 'Open positions',
        noPositions: 'No open positions currently',
        noPositionsDesc: 'We don\'t have any job openings at the moment, but we\'re always interested in spontaneous applications.',
      },
      spontaneous: {
        title: 'Spontaneous application',
        description: 'Can\'t find the right position? Send us your resume and cover letter.',
        email: 'contact@naturepharmacy.com',
        cta: 'Send your application',
      },
      benefits: {
        title: 'Our benefits',
        items: [
          'Competitive salary',
          'Health insurance',
          'Continuous training',
          'Modern work environment',
          'Work-life balance',
          'Growth opportunities',
        ],
      },
    },
    es: {
      title: 'Carreras',
      subtitle: 'Únete a nuestro equipo y participa en la revolución de la salud natural',
      why: {
        title: '¿Por qué unirte a nosotros?',
        items: [
          {
            title: 'Misión Inspiradora',
            description: 'Ayuda a mejorar la salud y el bienestar de miles de personas en todo el mundo',
          },
          {
            title: 'Innovación',
            description: 'Trabaja con las últimas tecnologías en un entorno dinámico',
          },
          {
            title: 'Crecimiento',
            description: 'Desarrolla tus habilidades con formación continua y oportunidades de avance',
          },
          {
            title: 'Impacto',
            description: 'Forma parte de una empresa que valora la sostenibilidad y la autenticidad',
          },
        ],
      },
      positions: {
        title: 'Puestos abiertos',
        noPositions: 'No hay puestos abiertos actualmente',
        noPositionsDesc: 'No tenemos ofertas de trabajo en este momento, pero siempre estamos interesados en candidaturas espontáneas.',
      },
      spontaneous: {
        title: 'Candidatura espontánea',
        description: '¿No encuentras el puesto adecuado? Envíanos tu currículum y carta de presentación.',
        email: 'contact@naturepharmacy.com',
        cta: 'Enviar tu candidatura',
      },
      benefits: {
        title: 'Nuestros beneficios',
        items: [
          'Salario competitivo',
          'Seguro de salud',
          'Formación continua',
          'Entorno de trabajo moderno',
          'Equilibrio trabajo-vida',
          'Oportunidades de crecimiento',
        ],
      },
    },
  };

  const t = content[locale] || content.fr;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          {/* Why Join Us */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.why.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.why.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.positions.title}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t.positions.noPositions}
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t.positions.noPositionsDesc}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.benefits.title}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {t.benefits.items.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spontaneous Application */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">{t.spontaneous.title}</h2>
              <p className="text-lg mb-6 text-green-50">{t.spontaneous.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={`mailto:${t.spontaneous.email}`}
                  className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  {t.spontaneous.cta}
                </a>
                <span className="text-green-100">{t.spontaneous.email}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

          </div>
  );
}
