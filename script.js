let currentHighlightIndex = -1;
let searchResults = [];

function searchWiki() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) return;

    // Reset vorige zoekresultaten
    removeHighlights();
    currentHighlightIndex = -1;
    searchResults = [];

    // Zoek in alle artikelen
    const articles = document.querySelectorAll('.article');
    articles.forEach(article => {
        const text = article.textContent;
        const regex = new RegExp(searchTerm, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            searchResults.push({
                element: article,
                position: match.index
            });
        }
    });

    if (searchResults.length > 0) {
        // Voeg navigatieknoppen toe
        addNavigationButtons();
        // Ga naar eerste resultaat
        navigateToNextResult();
    } else {
        alert('Geen resultaten gevonden');
    }
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    });
}

function addNavigationButtons() {
    // Verwijder bestaande knoppen als ze er zijn
    const existingButtons = document.querySelector('.search-navigation');
    if (existingButtons) {
        existingButtons.remove();
    }

    // Maak nieuwe navigatieknoppen
    const navigation = document.createElement('div');
    navigation.className = 'search-navigation';
    navigation.innerHTML = `
        <button onclick="navigateToPreviousResult()">Vorige</button>
        <span id="resultCounter"></span>
        <button onclick="navigateToNextResult()">Volgende</button>
    `;

    // Voeg knoppen toe na de zoekbalk
    const searchContainer = document.querySelector('.search-container');
    searchContainer.appendChild(navigation);
}

function navigateToNextResult() {
    if (searchResults.length === 0) return;
    
    currentHighlightIndex = (currentHighlightIndex + 1) % searchResults.length;
    highlightAndScrollToResult();
}

function navigateToPreviousResult() {
    if (searchResults.length === 0) return;
    
    currentHighlightIndex = (currentHighlightIndex - 1 + searchResults.length) % searchResults.length;
    highlightAndScrollToResult();
}

function highlightAndScrollToResult() {
    removeHighlights();
    
    const result = searchResults[currentHighlightIndex];
    const searchTerm = document.getElementById('searchInput').value;
    const regex = new RegExp(searchTerm, 'gi');
    
    // Highlight alle matches in het artikel
    const content = result.element.querySelector('.content');
    if (content) {
        // Bewaar de originele HTML structuur
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content.innerHTML;
        
        // Zoek en highlight tekst in alle tekst nodes
        function highlightText(node) {
            if (node.nodeType === 3) { // Text node
                const matches = node.textContent.match(regex);
                if (matches) {
                    const span = document.createElement('span');
                    span.innerHTML = node.textContent.replace(regex, match => 
                        `<span class="highlight">${match}</span>`
                    );
                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === 1) { // Element node
                // Skip bepaalde elementen die we niet willen highlighten
                if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                    return;
                }
                Array.from(node.childNodes).forEach(highlightText);
            }
        }
        
        highlightText(tempDiv);
        content.innerHTML = tempDiv.innerHTML;
    }

    // Scroll naar het resultaat
    result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Update teller
    const counter = document.getElementById('resultCounter');
    counter.textContent = `${currentHighlightIndex + 1} van ${searchResults.length}`;
}

// Voeg keyboard shortcuts toe
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('searchInput').value) {
        searchWiki();
    }
    if (e.key === 'n' && searchResults.length > 0) {
        navigateToNextResult();
    }
    if (e.key === 'p' && searchResults.length > 0) {
        navigateToPreviousResult();
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