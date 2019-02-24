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

export const checkTimeStringFormat = timeString => timeString.match(/[0-9]{1,2}:[0-9]{2}$/) !== null;
