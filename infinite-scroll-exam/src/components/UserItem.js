import React, {Component, Fragment} from 'react';

import './UserItem.less';

export default class UserItem extends Component {
  formattedDate = (utc) => {
    let dateValue = new Date(utc);
    if (this.isValidDate(dateValue)) {
      return dateValue.format();
    }
    return '';
  }

  isValidDate = (d) => {
    return d instanceof Date && !isNaN(d);
  }

  render() {
    const {item} = this.props;
    return (
      <Fragment>
        <li className={'user-item'}>
          <div className="user-wrapper">
            <span className={'user-num'}>{item.id}</span>
            <div className="user-content">
              <div className="user-key">{item.key}</div>
              <div className="user-uuid">{item.uuid}</div>
              <div className="user-created">{this.formattedDate(item.created)}</div>
            </div>
          </div>
        </li>
      </Fragment>
    );
  }
}
