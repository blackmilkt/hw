import React, {Component, Fragment} from 'react';

import './ListError.less';

export default class ListError extends Component {
  render() {
    const {onReloadClick} = this.props;
    return (
      <Fragment>
        <div id={'list-error'}>
          <div>
            Sorry! Something was wrong.<br />
            Please reload the list or try again later.
          </div>
          <div>
            <input type="button" className={'hw-btn'} value={'Reload'} title={'Reload'} onClick={onReloadClick}/>
          </div>
        </div>
      </Fragment>
    );
  }
}
