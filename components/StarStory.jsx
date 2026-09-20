export const starLabels = { situation: "Situação", task: "Tarefa", action: "Ação", result: "Resultado" };

export function StarStory({ story }) {
  return <dl className="starStory">
    {Object.entries(starLabels).map(([key, label]) => <div className={`starStep starStep-${key}`} key={key}>
      <dt><span aria-hidden="true">{label[0]}</span>{label}</dt>
      <dd>{story[key]}</dd>
    </div>)}
  </dl>;
}
