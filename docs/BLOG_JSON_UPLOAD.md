# Blog Article JSON Upload Guide

This guide explains how to upload blog articles using JSON files in the Nature Pharmacy admin interface.

## Overview

The JSON upload feature allows you to quickly import blog articles with all their content, metadata, and SEO information by uploading a structured JSON file. This is particularly useful for:

- Bulk content migration
- Content created by external writers
- Importing articles from other systems
- Maintaining version-controlled article drafts

## JSON File Structure

### Required Fields

All articles MUST include these fields:

```json
{
  "title": {
    "fr": "French title",
    "en": "English title",
    "es": "Spanish title"
  },
  "slug": "unique-url-slug",
  "content": {
    "fr": "<p>French HTML content</p>",
    "en": "<p>English HTML content</p>",
    "es": "<p>Spanish HTML content</p>"
  }
}
```

### Optional Fields

You can include these optional fields:

```json
{
  "excerpt": {
    "fr": "Short French description",
    "en": "Short English description",
    "es": "Short Spanish description"
  },
  "featuredImage": "https://example.com/image.jpg",
  "category": "health",
  "tags": ["tag1", "tag2", "tag3"],
  "isPublished": true,
  "seo": {
    "metaTitle": {
      "fr": "SEO title in French",
      "en": "SEO title in English",
      "es": "SEO title in Spanish"
    },
    "metaDescription": {
      "fr": "SEO description in French",
      "en": "SEO description in English",
      "es": "SEO description in Spanish"
    },
    "metaKeywords": ["keyword1", "keyword2"],
    "ogImage": "https://example.com/og-image.jpg",
    "canonicalUrl": "https://nature-pharmacy.com/blog/your-slug"
  }
}
```

## Field Descriptions

### Title, Excerpt, Content
All must be provided in three languages: `fr` (French), `en` (English), `es` (Spanish).

- **title**: The article headline (plain text)
- **excerpt**: Short summary (160 characters recommended, plain text)
- **content**: Full article body (HTML format)

### Slug
- Unique URL-friendly identifier
- Use lowercase letters, numbers, and hyphens only
- Example: `benefits-of-chamomile-tea`
- Must be unique across all articles

### Featured Image
- URL to the main article image
- Can be provided in JSON OR uploaded separately
- If both are provided, the uploaded file takes precedence
- Recommended size: 1200x630px

### Category
Choose one of the following:
- `health` - General health topics
- `nutrition` - Diet and nutrition
- `wellness` - Overall wellness and lifestyle
- `herbal` - Herbal remedies and plants
- `skincare` - Skin health and beauty
- `news` - Industry news and updates
- `tips` - Practical tips and advice

### Tags
Array of keywords related to the article. Used for search and filtering.

### Is Published
- `true`: Article will be visible on the public blog
- `false`: Article saved as draft (default)

### SEO Fields

#### metaTitle
The title that appears in search engine results and browser tabs. Should be:
- 50-60 characters
- Include primary keyword
- Unique per language

#### metaDescription
The description shown in search results. Should be:
- 150-160 characters
- Compelling and informative
- Include primary keyword

#### metaKeywords
Array of SEO keywords (5-10 recommended)

#### ogImage
Image for social media sharing (Open Graph). If not provided, featuredImage is used.
Recommended size: 1200x630px

#### canonicalUrl
The preferred URL for this article (helps prevent duplicate content issues)

## Auto-Generated Fields

If you don't provide SEO fields, the system will automatically generate them:

- **metaTitle**: Uses the article title
- **metaDescription**: Uses the excerpt, or first 160 characters of content
- **metaKeywords**: Uses the tags array
- **ogImage**: Uses the featured image

## Content HTML Guidelines

The `content` field accepts HTML. You can use these tags:

- Headings: `<h2>`, `<h3>`, `<h4>`
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Formatting: `<strong>`, `<em>`, `<a>`
- Images: `<img>`
- Blockquotes: `<blockquote>`

**Important**: Always start with `<h2>` for main sections (not `<h1>` - that's reserved for the article title).

## How to Upload

1. **Navigate to Admin Blog Section**
   - Go to `/admin/blog` in your admin dashboard
   - Click the "Upload from JSON" button

2. **Prepare Your Files**
   - Create your JSON file following the structure above
   - (Optional) Prepare a featured image file

3. **Upload**
   - Select your JSON file
   - Optionally select an image file (JPG, PNG, WebP)
   - Click "Upload Article"

4. **Validation**
   - The system will validate your JSON structure
   - Check that all required fields are present
   - Verify the slug is unique
   - Upload the featured image (if provided)

5. **Result**
   - Success: Article is created and you'll see a success message
   - Error: You'll receive a specific error message explaining what's wrong

## Example Workflow

1. **Create Article**: Write your content in your preferred editor
2. **Export to JSON**: Structure it according to the template in `blog-article-example.json`
3. **Prepare Image**: Resize to recommended dimensions
4. **Upload**: Use the admin interface to upload both files
5. **Review**: Check the article in the admin list
6. **Publish**: Set `isPublished: true` or edit after upload

## Common Errors and Solutions

### "Invalid JSON file"
- Check that your JSON is valid (use JSONLint.com)
- Ensure all brackets and quotes are properly closed
- Remove any trailing commas

### "Title in all languages is required"
- Verify you have `title.fr`, `title.en`, and `title.es`
- Ensure none are empty strings

### "Slug is required"
- Add a `slug` field to your JSON
- Use URL-friendly format (lowercase, hyphens only)

### "An article with this slug already exists"
- Choose a different, unique slug
- Check existing articles in the admin panel

### "Content in all languages is required"
- Verify you have `content.fr`, `content.en`, and `content.es`
- Ensure none are empty strings

### "Featured image is required"
- Either include `featuredImage` URL in JSON
- Or upload an image file along with the JSON
- Or both (uploaded file will be used)

## Best Practices

1. **Use the Example**: Start with `blog-article-example.json` as a template
2. **Validate JSON**: Use a JSON validator before uploading
3. **Test with Draft**: Set `isPublished: false` for initial uploads
4. **SEO Optimization**: Provide custom SEO fields for better search visibility
5. **Image Quality**: Use high-quality images with proper dimensions
6. **Content Structure**: Use proper HTML headings for better readability
7. **Keywords**: Include relevant tags for better discoverability
8. **Multilingual**: Ensure quality translations in all three languages

## Advanced: Bulk Upload

For multiple articles, you can:

1. Create multiple JSON files
2. Upload them one by one through the interface
3. Or use the API directly with a script:

```bash
curl -X POST http://localhost:3000/api/admin/blog/upload-json \
  -H "Cookie: your-session-cookie" \
  -F "json=@article.json" \
  -F "image=@featured-image.jpg"
```

## Need Help?

- See the complete example: `docs/blog-article-example.json`
- Check the Blog model: `models/Blog.ts`
- Review the API endpoint: `app/api/admin/blog/upload-json/route.ts`

## Security Notes

- Only admin users can upload articles
- File uploads are validated and sanitized
- Slugs are checked for uniqueness
- Image uploads go through the secure upload API
