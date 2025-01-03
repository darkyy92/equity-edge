export const markdownToHTML = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/### (.*?)\n/g, '<h3>$1</h3>')
    .replace(/## (.*?)\n/g, '<h2>$1</h2>')
    .replace(/# (.*?)\n/g, '<h1>$1</h1>');
};

export const extractSection = (text: string, section: string): string => {
  const regex = new RegExp(`${section}:?([^]*?)(?=(?:Investment Strategy|Technical Analysis|Market Analysis|Risk Factors):|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : `${section} information not available.`;
};