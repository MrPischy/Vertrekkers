function searchWiki() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const articles = document.querySelectorAll('.article');

    articles.forEach(article => {
        const title = article.querySelector('h2').textContent.toLowerCase();
        const content = article.textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            article.style.display = 'block';
            // Scroll naar het artikel als het gevonden is
            if (searchTerm.length > 0) {
                article.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            article.style.display = 'none';
        }
    });
}

// Zoeken wanneer Enter wordt ingedrukt
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWiki();
    }
});

// Reset zoekresultaten wanneer de zoekbalk wordt leeggemaakt
document.getElementById('searchInput').addEventListener('input', function(e) {
    if (e.target.value === '') {
        const articles = document.querySelectorAll('.article');
        articles.forEach(article => {
            article.style.display = 'block';
        });
    }
}); 