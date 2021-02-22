import {useEffect, useState} from "react";
import {List, Avatar, Row, Col, Button} from 'antd';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import {PushpinOutlined} from "@ant-design/icons";
import { io } from "socket.io-client";
import "./styles.css";

function App() {

    const [isLoading, setLoading]       = useState(true);
    const [isBannerShow, setBannerShow] = useState(true);
    const [data, setData]               = useState([]);
    const [selected, setSelected]       = useState([]);

    useEffect(() => {

        const socket = io("http://localhost:8000",{'transports': ['websocket', 'polling']});

        socket.on("live_chat", records => {

            setData(records.reverse());

            setLoading(false);
        });

    }, []);

    return (
        <div style={{ maxWidth : 1200, margin : "auto"}}>
            <Row>
                <Col span={24}>
                    <Row
                        style={{
                            padding      : "20px 0 0",
                            background   : "#00b140",
                            height       : 300,
                        }}
                        justify="space-between"
                        align="bottom"
                    >
                        <Col span={24}>
                            <SwitchTransition mode={ isBannerShow ? "in-out" : "out-in"}>
                                <CSSTransition
                                    key={isBannerShow}
                                    addEndListener={(node, done) => { node.addEventListener("transitionend", done, false) }}
                                    classNames={isBannerShow ? "fade2" : "fade3"}
                                >
                                    <div className={"list-container"}>
                                        {
                                            selected.length > 0 && isBannerShow === false ? (
                                                <SwitchTransition mode={"in-out"}>
                                                    <CSSTransition
                                                        key={selected[0].message}
                                                        addEndListener={(node, done) => { node.addEventListener("transitionend", done, false) }}
                                                        classNames="fade"
                                                    >
                                                        <div className={"list-selected-container"}>
                                                            <div
                                                                className={"list list-selected"}
                                                                style={{
                                                                    padding : "20px",
                                                                    background: "white",
                                                                    borderBottom : "1px solid #ddd"
                                                                }}
                                                            >

                                                                    <List
                                                                        loading={isLoading}
                                                                        itemLayout="horizontal"
                                                                        dataSource={selected}
                                                                        renderItem={item => (
                                                                            <List.Item>
                                                                                <List.Item.Meta
                                                                                    avatar={<Avatar size={"large"} src={item.photo} />}
                                                                                    title={<>{item.authorName} <PushpinOutlined style={{color : "#1890ff"}} /></>}
                                                                                    description={item.message}
                                                                                />
                                                                                <div>{item.timestamp}</div>
                                                                            </List.Item>
                                                                        )}
                                                                    />
                                                            </div>
                                                        </div>
                                                    </CSSTransition>
                                                </SwitchTransition>
                                            ) : (
                                                <div className={"list"}>
                                                    <img style={{width : "100%"}} src={"https://via.placeholder.com/1920x120.png"} alt={""} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </CSSTransition>
                            </SwitchTransition>
                        </Col>
                    </Row>
                </Col>
                <Col span={16}>
                    <div
                        style={{
                            padding      : 20,
                            background   : "white",
                            height       : "62.5vh",
                            overflow     : "auto"
                        }}
                    >
                        <List
                            loading={isLoading}
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item
                                    style={{cursor : "pointer"}}
                                    onClick={() => {
                                        setSelected([item])
                                        setBannerShow(false);
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar size={"large"} src={item.photo} />}
                                        title={item.authorName}
                                        description={item.message}
                                    />
                                    <div>{item.timestamp}</div>
                                </List.Item>
                            )}
                        />
                    </div>
                </Col>
                <Col span={8}>
                    <div
                        style={{
                            padding      : 20,
                            background   : "white",
                            height       : "62.5vh",
                            overflow     : "auto"
                        }}
                    >
                        <div style={{marginBottom : 20}}>
                            <img
                                style={{width : "100%"}}
                                src={"https://via.placeholder.com/1920x120.png"}
                                alt={""}
                            />
                        </div>
                        <Row gutter={[10, 30]}>
                            <Col span={12}>
                                <Button
                                    style={{width : "100%"}}
                                    size={"large"}
                                    // type={"primary"}
                                    onClick={() => setBannerShow(true)}
                                >
                                    Show Banner
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    style={{width : "100%"}}
                                    size={"large"}
                                    // type={"primary"}
                                    // ghost={true}
                                    onClick={() => setBannerShow(false)}
                                >
                                    Hide Banner
                                </Button>
                            </Col>
                            <Col span={24}>
                                <Button
                                    style={{width : "100%"}}
                                    size={"large"}
                                    type={"primary"}
                                    danger={true}
                                    onClick={() => {
                                        setBannerShow(true);
                                        setSelected([]);
                                    }}
                                >
                                    Clear Pinned
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default App;
