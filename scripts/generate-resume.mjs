import fs from "node:fs";
import { finished } from "node:stream/promises";
import PDFDocument from "pdfkit";
import { profile } from "../data/portfolio.js";
import { resume } from "../data/resume.js";

// The downloadable PDF is generated on every build from the HTML page's data.
const doc = new PDFDocument({ size: "A4", margin: 36, lang: "pt-BR", info: {
  Title: `Currículo — ${profile.name}`, Author: profile.name,
  CreationDate: new Date("2026-01-01T00:00:00Z"), ModDate: new Date("2026-01-01T00:00:00Z"),
} });
const stream = fs.createWriteStream("public/curriculo-henrique-fiorotti.pdf");
doc.pipe(stream);
const ensureSpace = height => { if (doc.y + height > doc.page.height - 36) doc.addPage(); };
const paragraph = (text, { bold = false, size = 9.5, link } = {}) => {
  doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(size).fillColor("#17151d");
  const height = doc.heightOfString(text, { width: 523, lineGap: 1 });
  ensureSpace(height + 5);
  doc.text(text, { width: 523, lineGap: 1, ...(link && { link, underline: true }) });
  doc.moveDown(.2);
};
const heading = title => { ensureSpace(50); doc.moveDown(.45); paragraph(title, { bold: true, size: 12 }); };
paragraph(profile.name, { bold: true, size: 23 });
paragraph("Desenvolvimento de sistemas & suporte de TI");
paragraph(`${profile.phone} | ${profile.email}`);
paragraph(profile.github, { link: profile.github, size: 9 });
paragraph(profile.linkedin, { link: profile.linkedin, size: 9 });
heading("Perfil profissional"); paragraph(resume.objective);
heading("Experiência profissional");
for (const item of resume.professionalExperience) {
  paragraph(`${item.role} — ${item.company}`, { bold: true });
  paragraph(`${item.period} | ${item.location}`, { size: 9 });
  paragraph(item.summary);
  if (item.star) {
    for (const [key, label] of Object.entries({ situation: "Situação", task: "Tarefa", action: "Ação", result: "Resultado" })) paragraph(`${label}: ${item.star[key]}`);
  } else item.details.forEach(detail => paragraph(`• ${detail}`));
}
heading("Formação acadêmica"); resume.education.forEach(item => paragraph(`• ${item}`));
heading("Projeto técnico");
for (const project of resume.projects) {
  paragraph(project.title, { bold: true }); paragraph(project.meta);
  project.details.forEach(item => paragraph(`• ${item}`));
}
heading("Competências técnicas");
resume.skillGroups.forEach(group => paragraph(`${group.title}: ${group.items.join(" · ")}`));
heading("Cursos e certificações"); resume.courses.forEach(item => paragraph(`• ${item}`));
heading("Idiomas"); resume.languages.forEach(item => paragraph(`• ${item}`));
doc.end();
await finished(stream);
console.log("PDF generated from data/resume.js and data/portfolio.js");
