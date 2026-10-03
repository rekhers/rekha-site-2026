export const statementParagraphs = [
  "I grew up in a different world. Anyone who was a kid in the 1990s remembers the spirit of multiculturalism that pervaded education and classroom art. We were taught to read, to be ourselves unapologetically, and to stand up against injustice, no matter how costly.",
  "Coming from a conservative immigrant family in Texas, this created a humanistic layer between their expectations and my dreams that I've held onto since those days. Later I went to college and took gender studies classes that changed my life. Even later, I built a career in explanatory, educational journalism.",
  "Many of the institutions that created those conditions have since been weakened, hollowed out, or abandoned. We are living with the consequences. This is my exploration."
];

export default function Statement() {
  return statementParagraphs.map((text) => <p key={text}>{text}</p>);
}
