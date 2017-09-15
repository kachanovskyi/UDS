import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './FlowDesigner.css';

import CustomDropdown from './CustomDropdown';
import NavButton from './NavButton';
import $ from 'jquery';
import vis from 'vis';

class FlowDesigner extends Component {

    constructor() {
        super();

        // this.saveName = this.saveName.bind(this);
        // this.loadData = this.loadData.bind(this);
        this.draw = this.draw.bind(this);
    };

    // loadData() {
    //     fetch('../data2.json')
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //
    //             draw(responseJson);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // };

    componentDidMount() {
        // this.loadData();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const data = {
            "botId": 17
        };

        fetch('https://fb0e43f6.ngrok.io/list-all', {
            method: 'POST',
            headers: myHeaders,
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.draw(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    draw(flow) {
        const self = this;
        var msgInput = $('#messageInput');

        var nodes = null;
        var edges = null;
        var network = null;
        var selectedNode = null,
            editableNode = null;
        var deletedNodes = [];

        function destroy() {
            if (network !== null) {
                network.destroy();
                network = null;
            }
        }

        console.log(flow);
        destroy();
        nodes = [];
        edges = [];
        var connectionCount = [];

        // randomly create some nodes and edges
        // nodes.push({
        //     id: 0,
        //     widthConstraint: 150,
        //     label: "Welcome message",
        //     color: "#F2994A",
        //     title: 'double click to edit'
        // });
        //
        // nodes[0]["level"] = 0;

        flow.forEach(function (node) {

            let color = "#E0E0E0";
            let level = null;

            if(node.parentId === null) {
                color = "#F2994A";
                level = 0;
            } else if(node.type === "BUTTON") {
                color = "#2D9CDB";
            }

            nodes.push({
                id: node.id,
                botId: node.botId,
                widthConstraint: 150,
                label: node.title,
                parentId: node.parentId,
                title: 'double click to edit',
                color: color
            });

            // if(node.parentId !== null) {
            //     nodes[findNode(node.id)]["level"] = nodes[findNode(node.parentId)]["level"] + 1;
            // }

            edges.push({from: node.parentId, to: node.id});
            // nodes[findNode(node.id)]["level"] = level;
        });

        // create a network
        var container = document.getElementById('flowDesigner');
        var data = {
            nodes: nodes,
            edges: edges
        };

        var options = {
            interaction: {
                dragNodes: false,
                hover: true
            },
            nodes: {
                shape: 'box',
                margin: 10,
                font: {
                    color: "#000000"
                },
                color: {
                    highlight: {
//                                border: '#2B7CE9',
                        background: '#D78536'
                    },
                    hover: {
                        background: "#F2995E"
                    }
                }
            },
            edges: {
//                        smooth: {
//                            type: 'vertical',
//                            forceDirection: 'vertical',
//                            roundness: 1
//                        },
                color: {
                    color: "#BDBDBD"
                }
            },
            layout: {
                hierarchical: {
                    direction: "UD",
                    levelSeparation: 200,
                    nodeSpacing: 200,
                    sortMethod: 'directed'
                }
            },
            physics: false,
            manipulation: {
                enabled: false,
                initiallyActive: false
//                    addNode: true
            }
        };
        network = new vis.Network(container, data, options);

        // add event listeners
        network.on('select', function (params) {

        });

        network.on("click", selectNode);
        network.on("doubleClick", getLabel);

        function ifStringEmpty(text) {
            return (text.length === 0 && !text.trim());
        }

        function updateNetwork() {
            data = {
                nodes: nodes,
                edges: edges
            };

            network = new vis.Network(container, data, options);
            network
                .on("click", selectNode)
                .on("doubleClick", getLabel);
        }

        function selectNode(params) {
            selectedNode = params.nodes[0];
//                console.log(network.body.data.nodes.length);
//                console.log(network.body.data.nodes._data);
//                params.event = "[original event]";
//                document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);
//                console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
        }

        function getLabel(params) {
            editableNode = params.nodes[0];
            if (editableNode || editableNode === 0) {
                $('#messageInput').val(nodes[findNode(editableNode)].label);
            }
        }

        function saveLabel() {
            var label = msgInput.val();

            if ((editableNode || editableNode === 0) && (!ifStringEmpty(label))) {
                nodes[findNode(editableNode)].label = label;

                updateNetwork();

                $('#messageInput').val("");
            } else if (ifStringEmpty(label)) {
                alert('Title can not be empty');
            }

            editableNode = null;
        }

        function addNode(type) {
            var typeColor,
                label = msgInput.val();

            if (type === "btn") {
                typeColor = "#2D9CDB";
                type = "BUTTON";
            } else if (type === "msg") {
                typeColor = "#E0E0E0";
                type = "MESSAGE";
            }

            if (selectedNode || selectedNode === 0) {
                var elemId = "tempID";
                // selectedNodeLevel = nodes[findNode(selectedNode)]["level"]

                if (!ifStringEmpty(label)) {
                    nodes.push({
                        id: elemId,
                        widthConstraint: 150,
                        label: label,
                        color: typeColor,
                        type: type,
                        parentId: selectedNode
                    });
                    // nodes[findNode(elemId)]["level"] = parseInt(selectedNodeLevel, 10) + 1;
                    edges.push({from: selectedNode, to: elemId});

                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const data = {
                        "bot_id":nodes[findNode(selectedNode)].botId,
                        "type":type,
                        "title": label,
                        "parent_flow_id": selectedNode,
                        "active":true
                    };

                    fetch('https://fb0e43f6.ngrok.io/create-element', {
                        method: 'POST',
                        headers: myHeaders,
                        credentials: 'same-origin',
                        body: JSON.stringify(data)
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {

                            nodes[findNode(elemId)].id = responseJson;
                            // nodes[findNode(responseJson)]["level"] = parseInt(selectedNodeLevel, 10) + 1;
                            console.log(nodes[findNode(responseJson)]);
                        })
                        .catch((error) => {
                            console.error(error);
                        });

                    updateNetwork();

                    selectedNode = null;
                    $('#messageInput').val("");
                } else {
                    alert('Message or button title can not be empty');
                }
            } else {
                alert("Select parent element first!");
            }
        }

        $('#addMessage').on("click", function () {
            addNode('msg');
        });
        $('#addButton').on("click", function () {
            addNode('btn');
        });

        $('#delete').on("click", deleteNode);

        $('#saveBtn').on("click", saveLabel);

        function findNodeIdByParentId(parentId) {
            var item = nodes.find(item => item.parentId === parentId);

            if (item !== undefined) {
                return item.id;
            }
            return -1;
        }

        function findNode(id) {
            var item = nodes.find(item => item.id === id);
            return nodes.indexOf(item);
        }

        function removeNode(id) {
            var nodeIndex = findNode(id);

            deletedNodes.push(nodes[nodeIndex]);
            nodes.splice(nodeIndex, 1);
        }

        function deleteNode() {
            deletedNodes.splice(0, deletedNodes.length);

            if (selectedNode) {
                console.log(selectedNode);
                console.log(nodes[findNode(selectedNode)].type);

//                 if (nodes[findNode(selectedNode)].type === "MESSAGE") {
//
//                     console.log('Edge from: ', nodes[findNode(selectedNode)].parentId);
//
//                     var counter = 0;
//                     var childId = findNodeIdByParentId(selectedNode);
//
//                     while (childId !== -1) {
//                         console.log("NOT HERE");
//                         edges.push({from: nodes[findNode(selectedNode)].parentId, to: childId});
//                         nodes[findNode(childId)]["level"] -= 1;
// //                                console.log(findNode(childId));
// //                                removeNode(childId);
//                         console.log(childId);
//                         childId = findNodeIdByParentId(childId);
//                         console.log(childId);
//                         counter++;
//                     }
//                     removeNode(selectedNode);
//
//                     data = {
//                         nodes: nodes,
//                         edges: edges
//                     };
// //
//                     network = new vis.Network(container, data, options);
//                     network.on("click", selectNode);
// //
//                     selectedNode = null;
//                 }

                const data = {
                    "id": nodes[findNode(selectedNode)].id
                };

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                fetch('https://fb0e43f6.ngrok.io/delete-element', {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {

                        responseJson.forEach(function (item) {
                            removeNode(item);
                        });

                        updateNetwork();
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            } else if (selectedNode === 0) {
                alert("You are not allowed to remove root element!");
            } else {
                alert("Select element you want to delete!");
            }
        }

        function deleteNodesChain(parentId) {

        }
    }


    // saveName() {
    //     const $bot = $($('.chatbot')[this.props.index + 1]);
    //     const newName = $bot.find('.rename-bot').val();
    //
    //     const data = {
    //         botId: this.props.id,
    //         name: newName
    //     };
    //
    //     fetch('./chatbots.json', {
    //             method: 'POST',
    //             body: data
    //         }
    //     )
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //
    //             let chatbots = [];
    //
    //             responseJson.forEach(item => {
    //                 chatbots.push(item);
    //             });
    //
    //             this.setState({
    //                 chatbots
    //             });
    //
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    //
    //     this.cancelRename($bot);
    // }


    render() {
        return (
            <div className="FlowDesigner">
                <div className="btn-container">
                    <div className="input-container">
                        <input id="messageInput" placeholder="Enter your message here..."/>
                        <button id="saveBtn">Save</button>
                    </div>
                    <div>
                        <button id="addMessage">Add message</button>
                        <button id="addButton">Add button</button>
                        <button id="delete">Delete</button>
                    </div>
                </div>

                <div id="flowDesigner"/>
            </div>
        )
    }

}

export default FlowDesigner;
