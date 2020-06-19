import React from 'react';

function App() {
  return (
    <div>
     hello react
    </div>
  );
}

// 之前版本写法
// App这个类继承了Component。 其实Component相当于React.Component
// 我们把继承了Component的类就叫做 React组件
/*
class App extends Component{
    render() {
        return (
            <div>
                hello React
            </div>
        );
    }
}
*/

export default App;
