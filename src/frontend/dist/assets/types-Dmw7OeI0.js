function formatPrice(paise) {
  return `₹${(Number(paise) / 100).toLocaleString("en-IN")}`;
}
function ratingToFloat(rating) {
  return Number(rating) / 10;
}
function discountedPrice(price, discountPercent) {
  return price - price * discountPercent / 100n;
}
export {
  discountedPrice as d,
  formatPrice as f,
  ratingToFloat as r
};
