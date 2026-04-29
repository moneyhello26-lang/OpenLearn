export default function SearchPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Поиск курсов</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Найдите идеальный курс для себя</p>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 space-y-4">
          <input
            type="text"
            placeholder="Поиск по названию или категории..."
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50">
              <option>Все категории</option>
              <option>Программирование</option>
              <option>Дизайн</option>
              <option>Бизнес</option>
            </select>
            
            <select className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50">
              <option>Сортировка</option>
              <option>По популярности</option>
              <option>По рейтингу</option>
              <option>Новые первыми</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Применить
            </button>
          </div>
        </div>

        {/* Courses list */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg p-6 flex gap-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Курс #{i}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Описание курса и его содержание...</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-yellow-500">⭐ 4.5/5 (234 отзыва)</span>
                  <span className="text-zinc-500">👥 1,234 студента</span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <span className="text-2xl font-bold text-blue-600">$29</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
