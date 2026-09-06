'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionHeading } from '@/components/PortfolioUI'
import { portfolioSections } from '@/config/sections'
const stack = {
  backend: ['TypeScript', 'Node.js', 'Python', 'C# / .NET', 'Express'],
  cloud: [
    'Microsoft Azure',
    'Azure Functions',
    'Service Bus',
    'SignalR',
    'Docker',
    'GitHub Actions',
  ],
  tools: ['PostgreSQL', 'CosmosDB', 'Redis', 'Claude API', 'GPT-4o', 'Gemini'],
  frontend: ['React', 'Next.js', 'JavaScript', 'HTML', 'CSS'],
}
export function Skills() {
  const { locale, t } = useLanguage()
  return (
    <section id="habilidades" className="portfolio-section">
      <div className="shell">
        <SectionHeading
          number="05"
          label={t('nav.skills')}
          title={t('design.skills_title')}
          description={t('design.skills_description')}
        />
        <div className="skills-list">
          {Object.entries(stack).map(([key, skills]) => (
            <div className="skill-row" key={key}>
              <h3>{t(`skills.categories.${key}`)}</h3>
              <div className="tag-list">
                {skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {portfolioSections.successStories && (
          <div className="services-grid">
            {locale.skills.stories.map((story) => (
              <article className="service-card" key={story.label}>
                <strong>{story.metric}</strong>
                <h3>{story.label}</h3>
                <p>{story.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
