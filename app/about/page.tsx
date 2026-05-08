export default function AboutPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-5">
      <div className="space-y-6">
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text)' }}>
            О платформе <span style={{ color: 'var(--teal)' }}>OpenLearn</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Открытая платформа для онлайн обучения, где каждый может найти курсы и поделиться своими знаниями
          </p>
        </section>


        <section className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Наши возможности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Широкий выбор', description: 'Тысячи курсов на различные темы' },
              { title: 'Качество контента', description: 'Курсы от опытных преподавателей' },
              { title: 'Рейтинги и отзывы', description: 'Система оценивания курсов студентами' },
              { title: 'Гибкое обучение', description: 'Учитесь в своем собственном темпе' },
              { title: 'Сертификаты', description: 'Получайте сертификаты после прохождения' },
              { title: 'Поддержка', description: 'Помощь от сообщества и модераторов' },
            ].map((feature, i) => (
              <div key={i} className="rounded-lg p-6" style={{ background: 'var(--surface)' }}>
                <div className="text-3xl mb-3">
                  {i === 0 && '📚'}
                  {i === 1 && '⭐'}
                  {i === 2 && '👥'}
                  {i === 3 && '⏰'}
                  {i === 4 && '🎓'}
                  {i === 5 && '🤝'}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="rounded-lg p-12" style={{ background: 'var(--teal-pale)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--teal)' }}>10,000+</div>
              <div style={{ color: 'var(--text-muted)' }}>Курсов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--teal)' }}>500,000+</div>
              <div style={{ color: 'var(--text-muted)' }}>Студентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--teal)' }}>1,000+</div>
              <div style={{ color: 'var(--text-muted)' }}>Инструкторов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--teal)' }}>4.7★</div>
              <div style={{ color: 'var(--text-muted)' }}>Средний рейтинг</div>
            </div>
          </div>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Остались вопросы?</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Свяжитесь с нами, и мы поможем вам!
          </p>
          <div className="flex gap-4 justify-center">
            <a  href="mailto:info@openlearn.kz" className="px-6 py-3 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: 'var(--blue)' }}>
              Email
            </a>
            <a href="#" className="px-6 py-3 rounded-lg transition-colors" style={{ background: 'var(--gray)', color: 'var(--text)' }}>
              Связаться
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
