export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="py-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50">
            Добро пожаловать в <span className="text-blue-600 dark:text-blue-400">OpenLearn</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Платформа для онлайн обучения с тысячами курсов на различные темы
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <a
              href="/search"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Найти курсы
            </a>
            <a
              href="/about"
              className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors font-semibold"
            >
              Подробнее
            </a>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Популярные курсы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="h-40 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Курс #{i}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Описание курса...</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">⭐ 4.5</span>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Подробнее →</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

