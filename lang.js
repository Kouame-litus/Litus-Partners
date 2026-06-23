(function(){
  var KEY = 'lp-lang';

  function applyLang(lang) {
    // Swap HTML content on elements with data-en
    document.querySelectorAll('[data-en]').forEach(function(el){
      if(!el.hasAttribute('data-fr')) el.setAttribute('data-fr', el.innerHTML);
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-fr');
    });
    // Swap input/textarea placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(function(el){
      if(!el.hasAttribute('data-placeholder-fr')) el.setAttribute('data-placeholder-fr', el.placeholder);
      el.placeholder = lang === 'en' ? el.getAttribute('data-placeholder-en') : el.getAttribute('data-placeholder-fr');
    });
    // Swap select option labels
    document.querySelectorAll('option[data-en]').forEach(function(el){
      if(!el.hasAttribute('data-fr')) el.setAttribute('data-fr', el.textContent);
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-fr');
    });
    // Update FR | EN switcher active state
    document.querySelectorAll('.lang-switch [data-lang]').forEach(function(btn){
      btn.setAttribute('data-active', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    document.documentElement.lang = lang;
    localStorage.setItem(KEY, lang);
  }

  window.getLang = function(){ return localStorage.getItem(KEY) || 'fr'; };
  window.setLang = function(lang){ applyLang(lang); };
  window.toggleLang = function(){ applyLang(getLang() === 'fr' ? 'en' : 'fr'); };

  document.addEventListener('DOMContentLoaded', function(){
    applyLang(getLang());
  });
})();
