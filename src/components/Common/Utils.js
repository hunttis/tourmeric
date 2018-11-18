export const mapCategoryToColor = (category) => {
  switch (category) {
    case 'green':
      return 'success';
    case 'red':
      return 'danger';
    case 'yellow':
      return 'warning';
    case 'blue':
      return 'info';
    default:
      return 'white';
  }
};
