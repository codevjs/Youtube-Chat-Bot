import {useEffect, useState} from "react";
import {List, Avatar, Row, Col} from 'antd';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { io } from "socket.io-client";
import "./styles.css";

const pinDefaultStyle = {
    photo : {
        background : "#1890ff"
    },
    name  : {
        background : "#1890ff",
        color      : "#fff"
    },
    message : {
        background : "#fff",
        color      : "rgba(0, 0, 0, 0.45)"
    }
}

if (!localStorage.getItem("pinDefaultStyle"))
    localStorage.setItem("pinDefaultStyle", JSON.stringify(pinDefaultStyle));

function View() {

    const [isBannerShow, setBannerShow] = useState(true);
    const [selected, setSelected]       = useState([]);
    const [pinStyle]                    = useState(JSON.parse(localStorage.getItem("pinDefaultStyle")));

    useEffect(() => {

        const socket = io("http://localhost:8000",{'transports': ['websocket', 'polling']});

        socket.on("selected", records => {

            setSelected(records);
        });

        socket.on("bannerShow", value => {

            setBannerShow(value);
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
                                                                style={{padding : "10px 10px 20px", width : "70%", margin : "auto"}}
                                                            >
                                                                <List
                                                                    style={{borderBottom : "none"}}
                                                                    itemLayout="horizontal"
                                                                    dataSource={selected}
                                                                    renderItem={item => (
                                                                        <List.Item>
                                                                            <List.Item.Meta
                                                                                avatar={
                                                                                    <Avatar
                                                                                        style={{
                                                                                            border : `3px solid ${pinStyle.photo.background}`,
                                                                                            borderRadius : "50%"
                                                                                        }}
                                                                                        size={50}
                                                                                        src={item.photo}
                                                                                    />
                                                                                }
                                                                                title={
                                                                                    <div style={{
                                                                                        background : pinStyle.name.background,
                                                                                        color : pinStyle.name.color,
                                                                                        marginTop : 10,
                                                                                        padding : "5px 0 5px 40px",
                                                                                        marginLeft : "-45px",
                                                                                        width : "90%",
                                                                                        borderRadius : 5
                                                                                    }}>
                                                                                        {item.authorName}
                                                                                    </div>
                                                                                }
                                                                                description={
                                                                                    <div
                                                                                        style={{
                                                                                            background : pinStyle.message.background,
                                                                                            color : pinStyle.message.color,
                                                                                            marginTop : "-5px",
                                                                                            marginLeft : "-45px",
                                                                                            padding : "5px 40px 10px",
                                                                                            paddingTop : 10,
                                                                                            width : "100%",
                                                                                            borderRadius : 5,
                                                                                            fontSize :"1.5em",
                                                                                            lineHeight : "1.2em"
                                                                                        }}
                                                                                    >
                                                                                        {item.message}
                                                                                    </div>
                                                                                }
                                                                            />
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CSSTransition>
                                                </SwitchTransition>
                                            ) : (
                                                <div className={"list"}>
                                                    <img style={{width : "100%"}} src={"/images/banner.jpg"} alt={""} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </CSSTransition>
                            </SwitchTransition>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default View;
