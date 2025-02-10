const trimText = (articles) => articles.map(({ text, ...rest }) => rest);

module.exports = {
  trimText,
};
