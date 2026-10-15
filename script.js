// Ładowanie historii oraz domyślnej ceny z pamięci LocalStorage
let laundryList = JSON.parse(localStorage.getItem('laundryHistory')) || [];
const defaultLaundryPrice = 3;

// Pierwsze uruchomienie aplikacji
updateUI();

function openModal() {
    const modal = document.getElementById('modalOverlay');
    const content = modal ? modal.querySelector('.modal-content') : null;
    if (!modal || !content) return;

    modal.style.display = 'flex';
    
    // Animacja ciemnego tła
    modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' });
    
    // Sprężysta animacja białego okienka (efekt pop-out z lekkim odbiciem)
    content.animate([
        { transform: 'scale(0.6) translateY(30px)', opacity: 0 },
        { transform: 'scale(1.05) translateY(-5px)', opacity: 1 },
        { transform: 'scale(1) translateY(0)', opacity: 1 }
    ], { duration: 350, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', fill: 'forwards' });
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    const content = modal ? modal.querySelector('.modal-content') : null;
    if (!modal || !content) return;

    // Płynne chowanie
    modal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    content.animate([
        { transform: 'scale(1) translateY(0)', opacity: 1 },
        { transform: 'scale(0.7) translateY(20px)', opacity: 0 }
    ], { duration: 200, easing: 'ease-in', fill: 'forwards' });

    // Wyłączenie widoczności po zakończeniu animacji
    setTimeout(() => {
        modal.style.display = 'none';
        const mainOpts = document.getElementById('modalOptionsMain');
        const customSec = document.getElementById('customInputSection');
        const input = document.getElementById('customPriceInput');
        if (mainOpts) mainOpts.style.display = 'flex';
        if (customSec) customSec.style.display = 'none';
        if (input) input.value = '';
    }, 200);
}

// Ta funkcja odpowiada za zamykanie okienka plusa po kliknięciu w puste tło
function closeModalOutside(e) {
    if (e.target.id === 'modalOverlay') {
        closeModal(); // OTO POPRAWKA: Ta linijka zmusza okienko do zniknięcia
    }
}

// --- POPRAWIONE FUNKCJE ANIMACJI OKIENKA ZĘBATKI (USTAWIENIA) ---
function openSettingsModal() {
    const modal = document.getElementById('settingsModalOverlay');
    const content = modal ? modal.querySelector('.modal-content') : null;
    
    if (input) input.value = defaultLaundryPrice.toFixed(2);
    if (!modal || !content) return;

    modal.style.display = 'flex';
    modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' });
    
    content.animate([
        { transform: 'scale(0.6) translateY(30px)', opacity: 0 },
        { transform: 'scale(1.05) translateY(-5px)', opacity: 1 },
        { transform: 'scale(1) translateY(0)', opacity: 1 }
    ], { duration: 350, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', fill: 'forwards' });
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModalOverlay');
    const content = modal ? modal.querySelector('.modal-content') : null;
    if (!modal || !content) return;

    modal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    content.animate([
        { transform: 'scale(1) translateY(0)', opacity: 1 },
        { transform: 'scale(0.7) translateY(20px)', opacity: 0 }
    ], { duration: 200, easing: 'ease-in', fill: 'forwards' });

    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

function showCustomInput() {
    document.getElementById('modalOptionsMain').style.display = 'none';
    document.getElementById('customInputSection').style.display = 'block';
    document.getElementById('customPriceInput').focus();
}

// --- OBSŁUGA MODALA ZĘBATKI (USTAWIENIA) ---
function openSettingsModal() {
    const modal = document.getElementById('settingsModalOverlay');
    const content = modal ? modal.querySelector('.modal-content') : null;
    const input = document.getElementById('defaultPriceInput');
    
    // Wpisujemy aktualną cenę domyślną do pola tekstowego
    if (input) input.value = defaultLaundryPrice.toFixed(2);
    if (!modal || !content) return;

    modal.style.display = 'flex';
    
    // Płynne ściemnianie tła okienka ustawień
    modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' });
    
    // Sprężysta animacja zębatki (identyczna jak przy plusie!)
    content.animate([
        { transform: 'scale(0.6) translateY(30px)', opacity: 0 },
        { transform: 'scale(1.05) translateY(-5px)', opacity: 1 },
        { transform: 'scale(1) translateY(0)', opacity: 1 }
    ], { duration: 350, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', fill: 'forwards' });
}

function borderReset() {
    document.getElementById('settingsModalOverlay').classList.remove('show');
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModalOverlay');
    const content = modal ? modal.querySelector('.modal-content') : null;
    if (!modal || !content) return;

    // Miękkie chowanie okienka ustawień do dołu
    modal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    content.animate([
        { transform: 'scale(1) translateY(0)', opacity: 1 },
        { transform: 'scale(0.7) translateY(20px)', opacity: 0 }
    ], { duration: 200, easing: 'ease-in', fill: 'forwards' });

    // Całkowite ukrycie elementu po zakończeniu animacji zanikania
    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

function closeSettingsModalOutside(e) {
    if (e.target.id === 'settingsModalOverlay') closeSettingsModal();
}

// Czyszczenie całej historii prań
function clearAllHistory() {
    if (confirm("Czy na pewno chcesz usunąć wszystkie zapisane kafelki i zresetować licznik?")) {
        laundryList = [];
        localStorage.removeItem('laundryHistory');
        updateUI();
        closeSettingsModal();
    }
}

// --- LOGIKA APLIKACJI ---
function getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function addStandardLaundry() {
    saveLaundryRecord(defaultLaundryPrice);
    closeModal();
}

function addCustomLaundry() {
    const input = document.getElementById('customPriceInput');
    const customPrice = parseFloat(input.value);

    if (!isNaN(customPrice) && customPrice > 0) {
        saveLaundryRecord(customPrice);
        closeModal();
    } else {
        alert('Proszę wpisać poprawną kwotę większą od zera!');
    }
}

function saveLaundryRecord(price) {
    const newRecord = {
        id: Date.now(),
        price: price.toFixed(2),
        date: getFormattedDate()
    };

    laundryList.unshift(newRecord);
    localStorage.setItem('laundryHistory', JSON.stringify(laundryList));
    updateUI();
}

function updateUI() {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    container.innerHTML = '';

    let totalSum = 0;

    laundryList.forEach(item => {
        totalSum += parseFloat(item.price);

        const card = document.createElement('div');
        card.className = 'laundry-card';
        card.innerHTML = `
            <div class="card-price">${parseFloat(item.price).toFixed(2)} zł</div>
            <div class="card-date">${item.date}</div>
        `;
        container.appendChild(card);
    });

    // Aktualizacja tekstów i cen na ekranie głównym
    document.getElementById('totalAmountDisplay').innerText = totalSum.toFixed(2) + ' zł';
    
    const label = document.getElementById('standardPriceLabel');
    if (label) label.innerText = defaultLaundryPrice.toFixed(2);

    // Dynamiczny cel paska postępu
    let currentGoal = 1000;
    while (totalSum >= currentGoal) {
        currentGoal += 1000;
    }

    const progressPercentage = (totalSum / currentGoal) * 100;
    document.getElementById('progressBarFill').style.width = Math.min(progressPercentage, 100) + '%';
    document.getElementById('progressTextDisplay').innerText = `Cel: ${totalSum.toFixed(2)} zł / ${currentGoal} zł`;
}
