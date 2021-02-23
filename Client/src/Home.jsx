import {useEffect, useState} from "react";
import {List, Avatar, Row, Col, Button, Drawer, Input, Form} from 'antd';
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

function Home() {

    const [isLoading, setLoading]       = useState(true);
    const [isBannerShow, setBannerShow] = useState(true);
    const [isDrawerShow, setDrawerShow] = useState(false);
    const [data, setData]               = useState([]);
    const [selected, setSelected]       = useState([]);
    const [socketIo, setSocketIo]       = useState();
    const [pinStyle, setPinStyle]       = useState(JSON.parse(localStorage.getItem("pinDefaultStyle")));
    const [form]                        = Form.useForm();

    const saveStyleSetting = (values) => {

        const styles =  {
            photo : {
                background : values.avatarBackground
            },
            name  : {
                background : values.nameBackground,
                color      : values.nameColor
            },
            message : {
                background : values.messageBackground,
                color      : values.messageColor
            }
        }

        setPinStyle(styles);

        localStorage.setItem("pinDefaultStyle", JSON.stringify(styles));
    }

    const resetStyle = () => {

        setPinStyle(pinDefaultStyle);

        localStorage.setItem("pinDefaultStyle", JSON.stringify(pinDefaultStyle));

        form.setFieldsValue({
            avatarBackground  : pinStyle.photo.background,
            nameBackground    : pinStyle.name.background,
            nameColor         : pinStyle.name.color,
            messageBackground : pinStyle.message.background,
            messageColor      : pinStyle.message.color,
        });
    }

    useEffect(() => {

        const socket = io("http://localhost:8000",{'transports': ['websocket', 'polling']});

        socket.on("live_chat", records => {

            setData(records.reverse());

            setLoading(false);
        });

        setSocketIo(socket);

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
                                                                style={{padding : "10px 22%"}}
                                                            >
                                                                <List
                                                                    style={{borderBottom : "none"}}
                                                                    loading={isLoading}
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
                                                                                        width : 500,
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
                                                                                            padding : "5px 0 5px 40px",
                                                                                            paddingTop : 10,
                                                                                            width : 550,
                                                                                            borderRadius : 5
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
                            overflow     : "auto",
                            borderTopLeftRadius : 5
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
                                        socketIo?.emit("selected", [item]);
                                        socketIo?.emit("bannerShow", false);
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
                            overflow     : "auto",
                            borderTopRightRadius : 5
                        }}
                    >
                        <div style={{marginBottom : 20}}>
                            <img
                                style={{width : "100%"}}
                                src={"https://via.placeholder.com/1920x120.png"}
                                alt={""}
                            />
                        </div>
                        <Row gutter={[10, 10]}>
                            <Col span={12}>
                                <Button
                                    style={{width : "100%", borderRadius : 5}}
                                    size={"large"}
                                    // type={"primary"}
                                    // ghost={true}
                                    onClick={() => {
                                        setBannerShow(true);
                                        socketIo?.emit("bannerShow", true);
                                    }}
                                >
                                    Show Banner
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    style={{width : "100%", borderRadius : 5}}
                                    size={"large"}
                                    // type={"primary"}
                                    // ghost={true}
                                    onClick={() => {
                                        setBannerShow(false);
                                        socketIo?.emit("bannerShow", false);
                                    }}
                                >
                                    Hide Banner
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    style={{width : "100%", borderRadius : 5}}
                                    size={"large"}
                                    // ghost={true}
                                    // danger={true}
                                    onClick={() => {
                                        setBannerShow(true);
                                        setSelected([]);
                                        socketIo?.emit("bannerShow", true);
                                        socketIo?.emit("selected", []);
                                    }}
                                >
                                    Clear Pinned
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    style={{width : "100%", borderRadius : 5}}
                                    size={"large"}
                                    onClick={() => setDrawerShow(true)}
                                >
                                    Style Setting
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            <Drawer
                title={null}
                placement={"right"}
                visible={isDrawerShow}
                closable={false}
                onClose={() => setDrawerShow(false)}
                width={350}
            >
                {/*<h4>Pinned Style</h4>*/}
                <div style={{position :"relative", height : "100%"}}>
                    <Form
                        layout={"vertical"}
                        onFinish={saveStyleSetting}
                        form={form}
                        initialValues={{
                            avatarBackground  : pinStyle.photo.background,
                            nameBackground    : pinStyle.name.background,
                            nameColor         : pinStyle.name.color,
                            messageBackground : pinStyle.message.background,
                            messageColor      : pinStyle.message.color,
                        }}
                    >
                        <Form.Item label={"Avatar Background"} name={"avatarBackground"}>
                            <Input size={"large"} />
                        </Form.Item>
                        <Form.Item label={"Name Background"} name={"nameBackground"}>
                            <Input size={"large"} />
                        </Form.Item>
                        <Form.Item label={"Name Text Color"} name={"nameColor"}>
                            <Input size={"large"} />
                        </Form.Item>
                        <Form.Item label={"Message Background"} name={"messageBackground"}>
                            <Input size={"large"} />
                        </Form.Item>
                        <Form.Item label={"Message Text Color"} name={"messageColor"}>
                            <Input size={"large"} />
                        </Form.Item>
                    </Form>

                    <div style={{
                        position : "absolute",
                        width : "100%",
                        bottom : 0
                    }}>
                        <Row gutter={[5,5]}>
                            <Col span={12}>
                                <Button
                                    size={"large"}
                                    style={{width : "100%"}}
                                    onClick={resetStyle}
                                >
                                    Reset
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    type={"submit"}
                                    size={"large"}
                                    style={{width : "100%"}}
                                    onClick={() => form.submit()}
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

export default Home;
