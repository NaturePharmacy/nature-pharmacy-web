'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface BlogArticle {
  _id: string;
  title: { fr: string; en: string; es: string };
  slug: string;
  excerpt: { fr: string; en: string; es: string };
  content: { fr: string; en: string; es: string };
  featuredImage: string;
  author: { _id: string; name: string; avatar?: string };
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  seo: {
    metaTitle: { fr: string; en: string; es: string };
    metaDescription: { fr: string; en: string; es: string };
    metaKeywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showJsonUpload, setShowJsonUpload] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: { fr: '', en: '', es: '' },
    slug: '',
    excerpt: { fr: '', en: '', es: '' },
    content: { fr: '', en: '', es: '' },
    featuredImage: '',
    category: 'health',
    tags: [] as string[],
    isPublished: false,
    seo: {
      metaTitle: { fr: '', en: '', es: '' },
      metaDescription: { fr: '', en: '', es: '' },
      metaKeywords: [] as string[],
      ogImage: '',
      canonicalUrl: '',
    },
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const categories = [
    { value: 'health', label: { fr: 'Santé', en: 'Health', es: 'Salud' } },
    { value: 'nutrition', label: { fr: 'Nutrition', en: 'Nutrition', es: 'Nutrición' } },
    { value: 'wellness', label: { fr: 'Bien-être', en: 'Wellness', es: 'Bienestar' } },
    { value: 'herbal', label: { fr: 'Herbes', en: 'Herbal', es: 'Hierbas' } },
    { value: 'skincare', label: { fr: 'Soins de la peau', en: 'Skincare', es: 'Cuidado de la piel' } },
    { value: 'news', label: { fr: 'Actualités', en: 'News', es: 'Noticias' } },
    { value: 'tips', label: { fr: 'Conseils', en: 'Tips', es: 'Consejos' } },
  ];

  const t = {
    fr: {
      title: 'Gestion du Blog',
      newArticle: 'Nouvel article',
      uploadJson: 'Uploader JSON',
      search: 'Rechercher...',
      allCategories: 'Toutes les catégories',
      allStatus: 'Tous les statuts',
      published: 'Publié',
      draft: 'Brouillon',
      category: 'Catégorie',
      views: 'Vues',
      author: 'Auteur',
      createdAt: 'Créé le',
      actions: 'Actions',
      edit: 'Modifier',
      delete: 'Supprimer',
      noArticles: 'Aucun article trouvé',
      editArticle: 'Modifier l\'article',
      createArticle: 'Créer un article',
      uploadJsonTitle: 'Uploader un article JSON',
      save: 'Enregistrer',
      cancel: 'Annuler',
      slug: 'Slug (URL)',
      featuredImage: 'Image à la une',
      tags: 'Tags',
      addTag: 'Ajouter tag',
      seoSettings: 'Paramètres SEO',
      metaTitle: 'Meta titre',
      metaDescription: 'Meta description',
      metaKeywords: 'Mots-clés',
      addKeyword: 'Ajouter mot-clé',
      ogImage: 'Image OG',
      canonicalUrl: 'URL canonique',
      jsonFile: 'Fichier JSON',
      imageFile: 'Image (optionnel)',
      upload: 'Upload',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet article ?',
    },
    en: {
      title: 'Blog Management',
      newArticle: 'New Article',
      uploadJson: 'Upload JSON',
      search: 'Search...',
      allCategories: 'All categories',
      allStatus: 'All status',
      published: 'Published',
      draft: 'Draft',
      category: 'Category',
      views: 'Views',
      author: 'Author',
      createdAt: 'Created at',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      noArticles: 'No articles found',
      editArticle: 'Edit Article',
      createArticle: 'Create Article',
      uploadJsonTitle: 'Upload JSON Article',
      save: 'Save',
      cancel: 'Cancel',
      slug: 'Slug (URL)',
      featuredImage: 'Featured Image',
      tags: 'Tags',
      addTag: 'Add tag',
      seoSettings: 'SEO Settings',
      metaTitle: 'Meta Title',
      metaDescription: 'Meta Description',
      metaKeywords: 'Keywords',
      addKeyword: 'Add keyword',
      ogImage: 'OG Image',
      canonicalUrl: 'Canonical URL',
      jsonFile: 'JSON File',
      imageFile: 'Image (optional)',
      upload: 'Upload',
      confirmDelete: 'Are you sure you want to delete this article?',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchArticles();
    }
  }, [session, searchTerm, categoryFilter, publishedFilter]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (publishedFilter) params.append('isPublished', publishedFilter);

      const res = await fetch(`/api/admin/blog?${params}`);
      const data = await res.json();

      if (res.ok) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'featuredImage' | 'ogImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'nature-pharmacy/blog');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (field === 'featuredImage') {
          setFormData(prev => ({ ...prev, featuredImage: data.url }));
        } else {
          setFormData(prev => ({ ...prev, seo: { ...prev.seo, ogImage: data.url } }));
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingArticle
        ? `/api/admin/blog/${editingArticle._id}`
        : '/api/admin/blog';

      const res = await fetch(url, {
        method: editingArticle ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchArticles();
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error saving article:', err);
    }
  };

  const handleJsonUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/blog/upload-json', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        fetchArticles();
        setShowJsonUpload(false);
        form.reset();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error('Error uploading JSON:', err);
    } finally {
      setUploading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm(tr.confirmDelete)) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  const openEditModal = (article: BlogArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      category: article.category,
      tags: article.tags,
      isPublished: article.isPublished,
      seo: article.seo,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: { fr: '', en: '', es: '' },
      slug: '',
      excerpt: { fr: '', en: '', es: '' },
      content: { fr: '', en: '', es: '' },
      featuredImage: '',
      category: 'health',
      tags: [],
      isPublished: false,
      seo: {
        metaTitle: { fr: '', en: '', es: '' },
        metaDescription: { fr: '', en: '', es: '' },
        metaKeywords: [],
        ogImage: '',
        canonicalUrl: '',
      },
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.metaKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, metaKeywords: [...prev.seo.metaKeywords, keywordInput.trim()] },
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, metaKeywords: prev.seo.metaKeywords.filter(k => k !== keyword) },
    }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{tr.title}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowJsonUpload(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {tr.uploadJson}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + {tr.newArticle}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder={tr.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">{tr.allCategories}</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label[locale]}
              </option>
            ))}
          </select>
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">{tr.allStatus}</option>
            <option value="true">{tr.published}</option>
            <option value="false">{tr.draft}</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tr.category}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tr.views}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tr.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {tr.noArticles}
                </td>
              </tr>
            ) : (
              articles.map(article => (
                <tr key={article._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={article.featuredImage}
                        alt={article.title[locale]}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{article.title[locale]}</div>
                    <div className="text-sm text-gray-500">{article.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {categories.find(c => c.value === article.category)?.label[locale]}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        article.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {article.isPublished ? tr.published : tr.draft}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{article.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(article)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {tr.edit}
                      </button>
                      <button
                        onClick={() => deleteArticle(article._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {tr.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Article Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingArticle ? tr.editArticle : tr.createArticle}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titles in all languages */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                {(['fr', 'en', 'es'] as const).map(lang => (
                  <input
                    key={lang}
                    type="text"
                    placeholder={`Titre (${lang.toUpperCase()})`}
                    value={formData.title[lang]}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        title: { ...prev.title, [lang]: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                ))}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tr.slug}</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Excerpts */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Extrait</label>
                {(['fr', 'en', 'es'] as const).map(lang => (
                  <textarea
                    key={lang}
                    placeholder={`Extrait (${lang.toUpperCase()})`}
                    value={formData.excerpt[lang]}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        excerpt: { ...prev.excerpt, [lang]: e.target.value },
                      }))
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                ))}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Contenu</label>
                {(['fr', 'en', 'es'] as const).map(lang => (
                  <textarea
                    key={lang}
                    placeholder={`Contenu (${lang.toUpperCase()})`}
                    value={formData.content[lang]}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        content: { ...prev.content, [lang]: e.target.value },
                      }))
                    }
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                ))}
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tr.featuredImage}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'featuredImage')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.featuredImage && (
                  <div className="mt-2 relative w-32 h-32">
                    <Image src={formData.featuredImage} alt="Featured" fill className="object-cover rounded" />
                  </div>
                )}
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{tr.category}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label[locale]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{tr.tags}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder={tr.addTag}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">{tr.seoSettings}</h3>

                {/* Meta Titles */}
                <div className="space-y-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700">{tr.metaTitle}</label>
                  {(['fr', 'en', 'es'] as const).map(lang => (
                    <input
                      key={lang}
                      type="text"
                      placeholder={`Meta Title (${lang.toUpperCase()})`}
                      value={formData.seo.metaTitle[lang]}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            metaTitle: { ...prev.seo.metaTitle, [lang]: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  ))}
                </div>

                {/* Meta Descriptions */}
                <div className="space-y-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700">{tr.metaDescription}</label>
                  {(['fr', 'en', 'es'] as const).map(lang => (
                    <textarea
                      key={lang}
                      placeholder={`Meta Description (${lang.toUpperCase()})`}
                      value={formData.seo.metaDescription[lang]}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            metaDescription: { ...prev.seo.metaDescription, [lang]: e.target.value },
                          },
                        }))
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  ))}
                </div>

                {/* Keywords */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{tr.metaKeywords}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder={tr.addKeyword}
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.seo.metaKeywords.map(keyword => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                      >
                        {keyword}
                        <button type="button" onClick={() => removeKeyword(keyword)} className="hover:text-red-600">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* OG Image and Canonical URL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{tr.ogImage}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'ogImage')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{tr.canonicalUrl}</label>
                    <input
                      type="url"
                      value={formData.seo.canonicalUrl}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo, canonicalUrl: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Publier immédiatement</label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {tr.cancel}
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {uploading ? 'Upload...' : tr.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON Upload Modal */}
      {showJsonUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">{tr.uploadJsonTitle}</h2>

            <form onSubmit={handleJsonUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tr.jsonFile}</label>
                <input
                  type="file"
                  name="json"
                  accept=".json"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tr.imageFile}</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJsonUpload(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {tr.cancel}
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Upload...' : tr.upload}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
