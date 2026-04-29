export default function ProfilePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
              U
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Ваше имя</h1>
                <p className="text-zinc-600 dark:text-zinc-400">user@example.com</p>
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Редактировать профиль
                </button>
                <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                  Параметры
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">12</div>
            <div className="text-zinc-600 dark:text-zinc-400 mt-2">Завершенных курсов</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">5</div>
            <div className="text-zinc-600 dark:text-zinc-400 mt-2">В процессе</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">4.6</div>
            <div className="text-zinc-600 dark:text-zinc-400 mt-2">Средний рейтинг</div>
          </div>
        </div>

        {/* My Courses */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Мои курсы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Курс #{i}</h3>
                <div className="mb-4">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Прогресс: 75%</div>
                  <div className="w-full bg-zinc-300 dark:bg-zinc-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Продолжить →</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
