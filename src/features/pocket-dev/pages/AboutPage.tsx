import { LcdPage, LcdPixelList, LcdScrollableArea } from '@/components/lcd'
import { resumeContent } from '@/content/resume/resumeContent'

export function AboutPage() {
  const { identity, activities } = resumeContent

  return (
    <LcdPage title="About">
      <LcdScrollableArea as="article" className="about-page">
        <header className="about-hero">
          <h2>
            {identity.name} / {identity.publicTitle}
          </h2>
          <p>{identity.location}</p>
        </header>

        <p>{identity.summary}</p>
        <p>
          Andrew builds practical web applications across front-end, back-end, and delivery work. He
          likes clear interfaces, maintainable code, and teams that can keep improving a product
          after launch.
        </p>

        <section aria-labelledby="about-activities">
          <h3 id="about-activities">After hours</h3>
          <LcdPixelList items={activities} />
        </section>
      </LcdScrollableArea>
    </LcdPage>
  )
}
