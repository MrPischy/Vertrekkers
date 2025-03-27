function showMore(cardId) {
    const card = document.getElementById(cardId);
    const content = card.querySelector('.card-content');
    const button = card.querySelector('.read-more');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        button.textContent = 'Lees meer';
    } else {
        content.classList.add('expanded');
        button.textContent = 'Lees minder';
    }
} 