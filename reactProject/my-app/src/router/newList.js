import React, {Component, Fragment} from 'react';
import { List, Typography, Divider } from 'antd';

const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
];
class newList extends Component {

    render() {
        // 可以通过props来获取从上一个页面link to传来的数据
        // 如果是 <Link to='/list?a=123'>  传来的 就在this.props.location.search， 数据前面有问号
        // console.log(this.props);
        // console.log(this.props.location.search);
        // 如果是 <Link to='/list/a=123'>  传来的  就在this.props.match.params 里面
        console.log(this.props);
        console.log(this.props.match.params);

        return (
            <Fragment>
                <Divider orientation="left">Default Size</Divider>
                <List
                    // 可以自己给个style
                    style={ {
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 10,
                    } }
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Typography.Text mark>[ITEM]</Typography.Text> {item}
                        </List.Item>
                    )}
                />
            </Fragment>
        )
    }

}

export default newList;