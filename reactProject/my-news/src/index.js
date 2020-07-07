import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './style.css'
import AppHeader from "./components/Header";

import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

class App extends Component{
    render() {
        return (
            <Layout style={ {
                minWidth: 1300,
            } }>
                <Header className='header'>
                    <AppHeader></AppHeader>
                </Header>
                <Content className='content'>Content</Content>
                <Footer className="footer">Footer</Footer>
            </Layout>
        )
    }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

