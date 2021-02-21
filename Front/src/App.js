import {useEffect, useState} from "react";
import { List, Avatar } from 'antd';
import { io } from "socket.io-client";

function App() {

    const [isLoading, setLoading] = useState(true);
    const [data, setData]         = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {

        const socket = io("http://localhost:8000",{'transports': ['websocket', 'polling']});

        socket.on("live_chat", records => {
            setData(records.reverse());
            setLoading(false);
        })

    }, []);

    return (
        <div
            style={{ maxWidth : 1200, margin : "auto",}}
        >
            <br/>
            <br/>

            {
                selected.length > 0 && (
                    <div
                        style={{
                            boxShadow : "rgba(0, 0, 0, 0.12) 0px 0px 8px 0px",
                            borderRadius : 10,
                            padding : 20,
                            background: "white"
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
                                        title={item.authorName}
                                        description={item.message}
                                    />
                                    <div>{item.timestamp}</div>
                                </List.Item>
                            )}
                        />
                    </div>
                )
            }

            <br/>

            <div
                style={{
                    boxShadow : "rgba(0, 0, 0, 0.12) 0px 0px 8px 0px",
                    borderRadius : 10,
                    padding : 20,
                    background: "white"
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
                                setSelected([item]);
                                window.scrollTo(0, 0);
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
            <br/>
            <br/>
        </div>
    );
}

export default App;
