// ─── DOM Elements ───
const grid = document.getElementById('favorites-grid')


// ─── localStorage ───

function getFavorites() {
    const data = localStorage.getItem('rick-morty-favorites')
    return data ? JSON.parse(data) : []
    // index.js'deki aynı fonksiyon
    // Aynı anahtar → aynı veri → iki sayfa aynı localStorage'ı kullanır
}

function removeFavorite(id) {
    const favorites = getFavorites()
    // Mevcut favorileri al

    const updated = favorites.filter(f => f.id !== id)
    // Bu id'ye sahip OLMAYAN karakterleri tut
    // = bu karakteri listeden çıkar

    localStorage.setItem('rick-morty-favorites', JSON.stringify(updated))
    // Güncellenmiş listeyi kaydet
}


// ─── Card ───

function createCard(character) {
    const statusColor =
        character.status === 'Alive' ? 'bg-green-500' :
            character.status === 'Dead'  ? 'bg-red-500'   :
                'bg-gray-500'

    return `
    <div class="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition">

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

        <!-- index.js'den fark: ⭐ değil 🗑 Remove butonu -->
        <button
          data-remove-id="${character.id}"
          class="mt-3 w-full bg-red-600 hover:bg-red-700
                 text-sm font-bold py-2 rounded-lg transition">
          🗑 Remove
        </button>
      </div>

    </div>
  `
}


// ─── Render ───

function renderGrid(characters) {
    if (characters.length === 0) {
        grid.innerHTML = `
      <div class="col-span-full text-center text-gray-400 py-20">
        <p class="text-4xl mb-3">⭐</p>
        <p class="text-xl">No favorites yet</p>
        <a href="index.html" class="text-green-400 underline mt-2 block">
          Go add some!
        </a>
      </div>
    `
        return
    }

    grid.innerHTML = characters
        .map(character => createCard(character))
        .join('')
}


// ─── Remove — Event Delegation ───

grid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-remove-id]')
    // data-remove-id → index.js'de data-id kullandık
    // favori.js'de data-remove-id → karışmasın diye farklı isim
    if (!btn) return

    const id = Number(btn.dataset.removeId)
    // btn.dataset.removeId → "1" (string) → Number ile sayıya çevir

    removeFavorite(id)
    // localStorage'dan sil

    loadFavorites()
    // Sayfayı yeniden çiz → silinen karakter artık görünmez
})


// ─── Init ───

function loadFavorites() {
    const favorites = getFavorites()
    renderGrid(favorites)
}

loadFavorites()