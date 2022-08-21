export const priceFormat = (num) => {
  if (!num) {
    return 0;
  }

  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
