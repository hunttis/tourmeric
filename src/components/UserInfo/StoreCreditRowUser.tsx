import React from 'react';
import moment from 'moment';
import { TourmericStoreCreditData } from '../../models/StoreCredit';

interface Props {
  data: TourmericStoreCreditData;
}

export const StoreCreditRowUser = ({ data }: Props) => (
  <tr>
    <td>{moment(data.date).format('DD-MM-YYYY - hh:mm')}</td>
    <td>{data.creditAddedByName}</td>
    <td>{data.note}</td>
    <td className={`${data.value > 0 ? 'has-text-success' : 'has-text-danger'}`}>{data.value} €</td>
  </tr>
);
