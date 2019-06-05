import React from 'react';
import ReactDOM from 'react-dom';

import './less/base.less';
import UsersList from './components/UsersList.js';

Date.prototype.format = function() {
  if (!this || !this.valueOf()) return '';
  const d = this;

  let month = d.getMonth();
  let date = d.getDate();
  month = ((month < 10)? '0' + month : month);
  date = ((date < 10)? '0' + date : date);
  const fullDate = [d.getFullYear(), month, date].join('-');

  let hours = d.getHours();
  let minutes = d.getMinutes();
  const milli = d.getMilliseconds();
  const ampm = (hours >= 12)? 'pm' : 'am';
  hours = hours % 12;
  hours = (hours)? hours : 12;
  minutes = (minutes < 10)? '0' + minutes : minutes;
  const time = [hours, minutes].join(':')

  return fullDate + ' ' + ampm.toUpperCase()+ ' ' + time + '.' + milli;
};

const root = document.getElementById('hw-user-list');
ReactDOM.render(<UsersList />, root);
