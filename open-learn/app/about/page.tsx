export default function AboutPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50">
            О платформе <span className="text-blue-600">OpenLearn</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Открытая платформа для онлайн обучения, где каждый может найти курсы и поделиться своими знаниями
          </p>
        </section>

        {/* Features */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Наши возможности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Широкий выбор', description: 'Тысячи курсов на различные темы' },
              { title: 'Качество контента', description: 'Курсы от опытных преподавателей' },
              { title: 'Рейтинги и отзывы', description: 'Система оценивания курсов студентами' },
              { title: 'Гибкое обучение', description: 'Учитесь в своем собственном темпе' },
              { title: 'Сертификаты', description: 'Получайте сертификаты после прохождения' },
              { title: 'Поддержка', description: 'Помощь от сообщества и модераторов' },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg p-6">
                <div className="text-3xl mb-3">
                  {i === 0 && '📚'}
                  {i === 1 && '⭐'}
                  {i === 2 && '👥'}
                  {i === 3 && '⏰'}
                  {i === 4 && '🎓'}
                  {i === 5 && '🤝'}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-blue-50 dark:bg-blue-950 rounded-lg p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-zinc-700 dark:text-zinc-300">Курсов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500,000+</div>
              <div className="text-zinc-700 dark:text-zinc-300">Студентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1,000+</div>
              <div className="text-zinc-700 dark:text-zinc-300">Инструкторов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.7★</div>
              <div className="text-zinc-700 dark:text-zinc-300">Средний рейтинг</div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Остались вопросы?</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Свяжитесь с нами, и мы поможем вам!
          </p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:info@openlearn.com" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Email
            </a>
            <a href="#" className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
              Связаться
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
