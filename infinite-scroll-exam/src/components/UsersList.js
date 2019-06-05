import React, {Component, Fragment} from 'react';
import axios from 'axios';

import UserItem from './UserItem.js';
import ListIndicator from "./ListIndicator.js";
import ListError from "./ListError.js";

import './UsersList.less';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      list: [],
      isAPILoading: false,
      isError: false
    };

    this.url = '/users';
    this.size = 20;
  }

  componentDidMount() {
    this.callList(1);
    window.addEventListener('scroll', this.toRequestAniFrame(this.handleScroll));
  }

  handleScroll = () => {
    const {isAPILoading, isError} = this.state

    if (isError || isAPILoading) return;

    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const currentScrollTop = window.pageYOffset;
    const clientHeight = document.documentElement.clientHeight;
    const currentScrollBottom = Math.round(clientHeight + currentScrollTop);
    if (currentScrollBottom >= scrollHeight - 70) {
      this.callList(this.state.page + 1);
    }
  }

  toRequestAniFrame = (run) => {
    if (!run) {
      throw Error('Invalid required arguments');
    }

    let isReady = false;

    return () => {
      if (isReady) return;

      isReady = true;
      return requestAnimationFrame(() => {
        isReady = false;
        return run();
      });
    }
  }

  callList = (currentPage) => {
    this.setState({
      isAPILoading: true,
      isError: false
    }, () => {
      axios.get(this.url, {
        params: {
          page: currentPage,
          size: this.size
        }
      })
        .then((response) => {
          let data = response.data;
          let mergedList = [...this.state.list, ...data.result];
          this.setState({
            list: mergedList,
            page: data.page,
            isAPILoading: false
          })
        }, (errors) => {
          this.setState({
            isAPILoading: false,
            isError: true
          });
          console.log('"callList"', errors);
        });
    });
  }

  onReloadClick = () => {
    this.callList(this.state.page + 1);
  }

  render() {
    const {list, isAPILoading, isError} = this.state;
    return (
      <Fragment>
        <div className={'list-container'}>
          {list.length <= 0 && !isAPILoading && !isError &&
            <div className={'list-empty'}>There's no data.</div>
          }
          {list.length > 0 &&
            <ul className={'user-items'}>
              {list.map((item) =>
                <UserItem key={item.key} item={item} />
              )}
            </ul>
          }
        </div>
        {isAPILoading &&
          <ListIndicator />
        }
        {
          !isAPILoading && isError &&
          <ListError onReloadClick={this.onReloadClick} />
        }
      </Fragment>
    );
  }
}
