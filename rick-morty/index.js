const grid = document.getElementById('grid');
const searchInput = document.getElementById('search-input');

// console.log(searchInput);
// console.log(grid);

let allCharacters = []
// console.log(allCharacters)

async function fetchCharacters() {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        if (!response.ok) {
            throw new Error(`Error fetching dat : ${response.status}.`);
        }

        const data = await response.json();
        // ‚

        return data.results.map(character => ({
            id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            image: character.image,

        }));

    }catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

// ---- localStorage ----
function getFavorites() {
    const data = localStorage.getItem('rick-morty-favorites')
    return data ? JSON.parse(data) : []
}

function addFavorite(character) {
    const favorites = getFavorites()
    const alreadyAdded = favorites.some(f => f.id === character.id)
    if (alreadyAdded) return
    favorites.push(character)
    localStorage.setItem('rick-morty-favorites', JSON.stringify(favorites))
}

function isFavorite(id) {
    return getFavorites().some(f => f.id === id)
}

function createCard(character) {
    const statusColor =
        character.status === 'Alive' ? 'bg-green-500' :
            character.status === 'Dead' ? 'bg-red-500' :
                'bg-gray-500';
    const btnText  = isFavorite(character.id) ? '✅ Already Added'         : '⭐ Add to Favorites'
    const btnColor = isFavorite(character.id) ? 'bg-gray-600 cursor-default' : 'bg-green-600 hover:bg-green-700'

    return `
        <div class="bg-gray-800 rounded-xl overflow-hidden
                hover:bg-gray-700 transition cursor-pointer">

      <img src="${character.image}"
           alt="${character.name}"
           class="w-full h-48 object-cover" />

      <div class="p-4">
        <h3 class="font-bold text-lg">${character.name}</h3>

        <div class="flex items-center gap-2 mt-1">
          <span class="w-2 h-2 rounded-full ${statusColor}"></span>
          <span class="text-gray-300 text-sm">
            ${character.status} · ${character.species}
          </span>
        </div>

        <button
          data-id="${character.id}"
          class="mt-3 w-full ${btnColor}
         text-sm font-bold py-2 rounded-lg transition">
            ${btnText}
        </button>
      </div>

    </div>
    
    `
}

// ─── Favorite Toggle ───
grid.addEventListener('click', (event) => {

    // Tıklanan element veya üstünde data-id var mı?
    const btn = event.target.closest('[data-id]')
    // Butona değil karta tıklandıysa → btn = null → çık
    if (!btn) return

    // data-id'yi al → string geliyor → number'a çevir
    const id = Number(btn.dataset.id)
    // btn.dataset.id → "1" (string)
    // Number("1")    → 1 (number)
    // Neden number? character.id number, karşılaştırma için eşit tip lazım

    // Bu id'ye sahip karakteri allCharacters'da bul
    const character = allCharacters.find(c => c.id === id)
    if (!character) return
    // Bulamazsa → çık (teorik olarak olmamalı)

    // Zaten favorideyse → hiçbir şey yapma
    if (isFavorite(id)) return

    // Favoriye ekle
    addFavorite(character)

    // Butonu güncelle — sayfayı yeniden çizmeden sadece bu butonu değiştir
    btn.textContent = '✅ Already Added'
    btn.classList.remove('bg-green-600', 'hover:bg-green-700')
    btn.classList.add('bg-gray-600', 'cursor-default')
})

function renderGrid(characters) {
    // Eğer liste boşsa "bulunamadı" mesajı göster
    if (characters.length === 0) {
        grid.innerHTML = `
      <div class="col-span-full text-center text-gray-400 py-20">
        <p class="text-4xl mb-3">🔍</p>
        <p>No characters found</p>
      </div>
    `
        return
        // return → innerHTML'e geçme, fonksiyondan çık
    }

    // Her karakter için createCard çağır → HTML string array
    // .join('') → array'i tek string yap
    // innerHTML → grid'e yaz → tarayıcı ekrana çizer
    grid.innerHTML = characters
        .map(character => createCard(character))
        .join('')
}


async function init() {
    // Yüklenirken kullanıcı boş ekran görmesin
    grid.innerHTML = `
    <div class="col-span-full text-center text-gray-400 py-20">
      <p class="text-4xl mb-3">⏳</p>
      <p>Loading characters...</p>
    </div>
  `
    allCharacters = await fetchCharacters();
    renderGrid(allCharacters)
}

// ─── Search ───
searchInput.addEventListener('input', () => {
    // Kullanıcının yazdığını al
    const query = searchInput.value.trim().toLowerCase()

    // Kutu boşsa tümünü göster
    if (!query) {
        renderGrid(allCharacters)
        return
    }

    // İsim veya türe göre filtrele
    const filtered = allCharacters.filter(character =>
        character.name.toLowerCase().includes(query) ||
        character.species.toLowerCase().includes(query)
    )

    renderGrid(filtered)
})

// ─── Search ───
searchInput.addEventListener('input', () => {
    // Kullanıcının yazdığını al
    const query = searchInput.value.trim().toLowerCase()

    // Kutu boşsa tümünü göster
    if (!query) {
        renderGrid(allCharacters)
        return
    }

    // İsim veya türe göre filtrele
    const filtered = allCharacters.filter(character =>
        character.name.toLowerCase().includes(query) ||
        character.species.toLowerCase().includes(query)
    )

    renderGrid(filtered)
})

init()










