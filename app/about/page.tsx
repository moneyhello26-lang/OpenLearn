import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto">
      
      <div className="mb-16 slide-up text-center">
        <Link href="/" className="text-sm text-muted hover:text-foreground font-medium mb-6 inline-block">&larr; На главную</Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ letterSpacing: '-0.04em' }}>
          О проекте
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          OpenLearn создан для того, чтобы сделать качественное образование доступным каждому школьнику и абитуриенту в Казахстане. Без рекламы. Без скрытых платежей.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-20 slide-up delay-1">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Наша миссия</h2>
          <p className="text-muted mb-4">
            Мы верим, что знания не должны быть привилегией. В эпоху цифровизации доступ к качественным учебным материалам должен быть базовым правом каждого ученика, независимо от его места проживания или финансового положения.
          </p>
          <p className="text-muted">
            Платформа объединяет учебники, методические пособия, информацию о грантах и стипендиях, создавая единую экосистему для развития и обучения.
          </p>
        </div>
        
        <div className="card p-8 bg-[var(--accents-1)]">
          <h3 className="text-xl font-semibold mb-6 tracking-tight">Ключевые принципы</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="text-foreground">01</span>
              <div>
                <p className="font-medium text-sm">Полная открытость</p>
                <p className="text-sm text-muted mt-1">Все базовые материалы доступны без регистрации и оплаты.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">02</span>
              <div>
                <p className="font-medium text-sm">ИИ-интеграция</p>
                <p className="text-sm text-muted mt-1">Использование нейросетей для персонализации обучения.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">03</span>
              <div>
                <p className="font-medium text-sm">Скорость и минимализм</p>
                <p className="text-sm text-muted mt-1">Ничего лишнего. Только контент и удобная навигация.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="card p-12 text-center slide-up delay-2">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Присоединяйтесь к нам</h2>
        <p className="text-muted max-w-xl mx-auto mb-8">
          Если вы хотите помочь развитию проекта, добавить свои материалы или стать партнером платформы — свяжитесь с нами.
        </p>
        <a href="mailto:contact@openlearn.kz" className="btn btn-primary text-base px-8 py-3">
          Написать нам
        </a>
      </div>

    </div>
  );
}
