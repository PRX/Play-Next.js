const generateHtmlString = (str: string) => {
  if (typeof str !== 'string') return str;

  let html = str.trim();
  const rgxHtml = /^<[^>]+>.*<\/[^>]+>$/;
  if (!rgxHtml.test(html)) {
    html = html
      .split(/\n+/)
      .map((s) => (rgxHtml.test(s) ? s : `<p>${s}</p>`))
      .join('');
  }
  return html;
};

export default generateHtmlString;
