import React, {Component} from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line
import TodoList from './TodoList/TodoList';
// eslint-disable-next-line
import Counter from './Counter/counter'
// eslint-disable-next-line
import Counter2 from "./Counter/counter2";
import 'antd/dist/antd.css';

import {BrowserRouter, Route} from 'react-router-dom';

import List from './router/newList'
import Button from './router/newButton'

class Entry extends Component {
    render(){
        return (
            <BrowserRouter>
                {/*BrowserRouter下也只能有一个元素*/}
                <div>
                    <Route path='/list' component={List}></Route>
                    {/*这样写是表明上一级页面，如果访问的是/list/后面接了任何东西，都作为id传入*/}
                    <Route path='/list/:id' component={List}></Route>
                    <Route path='/button' component={Button}></Route>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(
  <React.StrictMode>
      {/*render只能一次渲染一个大标签    一次渲染多个组件需要在外面包一层*/}
      {/*<TodoList />*/}
      {/*<Counter />*/}
      {/*<Counter2 />*/}
      <Entry />
  </React.StrictMode>,
  document.getElementById('root')
);
