'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">{question}</span>
        <svg
          className={`w-6 h-6 text-green-600 transform transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-5 pt-0 bg-gray-50">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Categories of questions
  const categories = [
    {
      title: t('categoryGeneral'),
      icon: '❓',
      questions: Array.from({ length: 5 }, (_, i) => ({
        question: t(`general.q${i + 1}`),
        answer: t(`general.a${i + 1}`),
      })),
    },
    {
      title: t('categoryAccount'),
      icon: '👤',
      questions: Array.from({ length: 5 }, (_, i) => ({
        question: t(`account.q${i + 1}`),
        answer: t(`account.a${i + 1}`),
      })),
    },
    {
      title: t('categoryOrders'),
      icon: '📦',
      questions: Array.from({ length: 5 }, (_, i) => ({
        question: t(`orders.q${i + 1}`),
        answer: t(`orders.a${i + 1}`),
      })),
    },
    {
      title: t('categoryPayment'),
      icon: '💳',
      questions: Array.from({ length: 4 }, (_, i) => ({
        question: t(`payment.q${i + 1}`),
        answer: t(`payment.a${i + 1}`),
      })),
    },
    {
      title: t('categoryShipping'),
      icon: '🚚',
      questions: Array.from({ length: 4 }, (_, i) => ({
        question: t(`shipping.q${i + 1}`),
        answer: t(`shipping.a${i + 1}`),
      })),
    },
    {
      title: t('categoryReturns'),
      icon: '↩️',
      questions: Array.from({ length: 4 }, (_, i) => ({
        question: t(`returns.q${i + 1}`),
        answer: t(`returns.a${i + 1}`),
      })),
    },
    {
      title: t('categorySeller'),
      icon: '🏪',
      questions: Array.from({ length: 4 }, (_, i) => ({
        question: t(`seller.q${i + 1}`),
        answer: t(`seller.a${i + 1}`),
      })),
    },
    {
      title: t('categoryProducts'),
      icon: '🌿',
      questions: Array.from({ length: 3 }, (_, i) => ({
        question: t(`products.q${i + 1}`),
        answer: t(`products.a${i + 1}`),
      })),
    },
  ];

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-gray-700">
              {t('contactPrompt')}{' '}
              <Link href="/contact" className="text-green-600 hover:underline font-semibold">
                {t('contactLink')}
              </Link>
            </p>
          </div>
        </div>

        {/* Search hint */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 text-sm">{t('searchHint')}</p>
        </div>

        {/* FAQ Categories */}
        {categories.map((category, categoryIdx) => (
          <div key={categoryIdx} className="mb-10">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">{category.icon}</span>
              <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
            </div>
            <div className="space-y-0">
              {category.questions.map((item, idx) => {
                const currentIndex = globalIndex++;
                return (
                  <AccordionItem
                    key={currentIndex}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openIndex === currentIndex}
                    onClick={() => toggleAccordion(currentIndex)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Still have questions? */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">{t('stillHaveQuestions')}</h3>
          <p className="text-green-50 mb-6">{t('contactPromptFull')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              {t('contactButton')}
            </Link>
            <Link
              href="/support"
              className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors border-2 border-white"
            >
              {t('supportButton')}
            </Link>
          </div>
        </div>

        {/* Related pages */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('relatedPages')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/shipping" className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('shippingLink')}
            </Link>
            <Link href="/returns" className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('returnsLink')}
            </Link>
            <Link href="/terms-of-sale" className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('cgvLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
