import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './TodoList/TodoList';

ReactDOM.render(
  <React.StrictMode>
      {/*render只能一次渲染一个大标签    一次渲染多个组件需要在外面包一层*/}
      <TodoList />
  </React.StrictMode>,
  document.getElementById('root')
);
