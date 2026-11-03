/* global lunr, store */

(() => {
  'use strict';

  const searchInput = document.querySelector('input#search');
  const resultsContainer = document.getElementById('results');
  if (!(searchInput instanceof HTMLInputElement) || !resultsContainer) return;

  /** @type {lunr.Index} */
  const searchIndex = lunr(/** @this {lunr.Builder} */ function () {
    ['title', 'excerpt', 'categories', 'tags'].forEach(field => this.field(field, {}));
    this.ref('id');
    this.pipeline.remove(lunr.trimmer);

    store.forEach((document, id) => {
      this.add({
        title: document.title,
        excerpt: document.excerpt,
        categories: document.categories,
        tags: document.tags,
        id
      }, {});
    });
  });

  // Lunr assigns these constants dynamically to a String object.
  /** @type {String & {TRAILING: number}} */
  const wildcards = lunr.Query.wildcard;

  /**
   * @param {string} tag
   * @param {string} className
   * @param {string} [text]
   * @returns {HTMLElement}
   */
  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const terms = query.split(lunr.tokenizer.separator).filter(term => /[\p{L}\p{N}]/u.test(term));
    const results = terms.length ? searchIndex.query(/** @param {lunr.Query} searchQuery */ searchQuery => {
      terms.forEach(term => {
        searchQuery.term(term, { boost: 100 });
        if (!query.endsWith(' ')) {
          searchQuery.term(term, { usePipeline: false, wildcard: wildcards.TRAILING, boost: 10 });
        }
        if (Array.from(term).length >= 3) {
          searchQuery.term(term, { usePipeline: false, editDistance: 1, boost: 1 });
        }
      });
    }) : [];

    const fragment = document.createDocumentFragment();
    const resultsLabel = searchInput.dataset.resultsFound || 'Result(s) found';
    fragment.appendChild(createElement('p', 'results__found', `${results.length} ${resultsLabel}`));

    results.forEach(result => {
      const entry = store[result.ref];
      const item = createElement('div', 'list__item');
      const article = createElement('article', 'archive__item');
      article.setAttribute('itemscope', '');
      article.setAttribute('itemtype', 'https://schema.org/CreativeWork');

      const title = createElement('h2', 'archive__item-title');
      title.setAttribute('itemprop', 'headline');
      const link = document.createElement('a');
      link.href = entry.url;
      link.rel = 'permalink';
      link.textContent = entry.title;
      title.appendChild(link);
      article.appendChild(title);

      if (entry.teaser) {
        const teaser = createElement('div', 'archive__item-teaser');
        const image = document.createElement('img');
        image.src = entry.teaser;
        image.alt = '';
        teaser.appendChild(image);
        article.appendChild(teaser);
      }

      const excerpt = createElement('p', 'archive__item-excerpt', `${entry.excerpt.split(' ').slice(0, 20).join(' ')}...`);
      excerpt.setAttribute('itemprop', 'description');
      article.appendChild(excerpt);
      item.appendChild(article);
      fragment.appendChild(item);
    });

    resultsContainer.replaceChildren(fragment);
  });
})();
