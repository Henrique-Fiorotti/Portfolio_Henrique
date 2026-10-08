// The résumé laid out as an A4 page. Rendered twice: scaled down as the clickable thumbnail, full size in the modal.
export function ResumeSheet({
  t,
  resume,
  profile
}) {
  const list = items => <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;
  return <article className="resumeSheet">
      <header className="sheetHeader">
        <div>
          <p>{t.role}</p>
          <h2>{profile.name}</h2>
        </div>
        <address>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </address>
      </header>
      <section><h3>{t.objective}</h3><p>{resume.objective}</p></section>
      <section><h3>{t.education}</h3>{list(resume.education)}</section>
      <section>
        <h3>{t.experience}</h3>
        {resume.experience.map(item => <div className="sheetItem" key={item.title}><h4>{item.title}</h4>{list(item.details)}</div>)}
      </section>
      <section><h3>{t.courses}</h3>{list(resume.courses)}</section>
      <div className="sheetColumns">
        <section><h3>{t.hardSkills}</h3>{list(resume.hardSkills)}</section>
        <section><h3>{t.softSkills}</h3>{list(resume.softSkills)}</section>
        <section><h3>{t.languages}</h3>{list(resume.languages)}</section>
      </div>
    </article>;
}
