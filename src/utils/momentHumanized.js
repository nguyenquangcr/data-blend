import moment from 'moment';

export const momentTripleSliptTime = () => {
  const currentHour = moment().format('HH');
  if (currentHour == 0 || currentHour < 12) return 'Good Morning';
  else if (currentHour <= 19) return 'Good Afternon';
  else return 'Good Evening';
};
