import moment from 'moment';
import { CATEGORY_GREEN, CATEGORY_RED, CATEGORY_BLUE, CATEGORY_YELLOW } from '../../models/StoreCredit';
import {parse} from 'date-fns';

export const mapCategoryToColor = (category: string) => {
  switch (category) {
    case CATEGORY_GREEN:
      return 'success';
    case CATEGORY_RED:
      return 'danger';
    case CATEGORY_YELLOW:
      return 'warning';
    case CATEGORY_BLUE:
      return 'info';
    default:
      return 'white';
  }
};

export const checkTimeStringFormat = (timeString: string) => timeString.match(/[0-9]{1,2}:[0-9]{2}$/) !== null;

export const createDateFromDateString = (dateString: string) => parse(dateString, 'yyyy-MM-dd', new Date());
export const createMomentFromDateString = (dateString: string) => moment(dateString, 'YYYY-MM-DD');
export const createCurrentMoment = () => moment();
