const iconMap = {
  HTML: "html-5-svgrepo-com.svg",
  CSS: "css-3-svgrepo-com.svg",
  JavaScript: "js-svgrepo-com.svg",
  Python: "python-svgrepo-com.svg",
  PHP: "php01-svgrepo-com.svg",
  Tailwind: "tailwind-svgrepo-com.svg",
  GitHub: "github-icon-1.svg",
  "VS Code": "vscode-svgrepo-com.svg",
  Excel: "excel-svgrepo-com.svg",
  Word: "word-svgrepo-com.svg",
  Canva: "canva-svgrepo-com.svg",
  Illustrator: "adobe-illustrator-svgrepo-com.svg",
  Photoshop: "adobe-photoshop-svgrepo-com.svg"
};
export function SkillPill({
  name
}) {
  const icon = iconMap[name];
  return <span className="skillPill">
      {icon && <img src={`/images/${icon}`} alt="" width="18" height="18" />}
      {name}
    </span>;
}
