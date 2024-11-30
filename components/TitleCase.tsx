const TitleCase = (text: string) => {
    return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const TruncatedText = (text: string, maxLength: number) => {
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    return truncatedText
  };

export default TitleCase