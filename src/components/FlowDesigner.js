import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './FlowDesigner.css';

import {notifyModalShow} from '../externalFunctions';
import NotifyModal from './NofityModal';
import $ from 'jquery';
import vis from 'vis';
import visStyles from 'vis/dist/vis.css';

class FlowDesigner extends Component {

    constructor() {
        super();
        this.botId = null;
        this.deletedNodes = [];

        this.state = {
            nodes: []
        };

        this.draw = this.draw.bind(this);
        this.undo = this.undo.bind(this);
    };

    componentDidMount() {
        // this.loadData();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const data = {
            "botId": this.props.match.params.botId
        };

        fetch('https://udigital.botscrew.com/list-all', {
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

    draw(flow, param) {

        const self = this;

        const msgInput = $('#messageInput');

        let nodes = null,
            edges = null;
        let network = null;
        let selectedNode = null,
            editableNode = null;

        let deletedNodes = [],
            nodesArray = [],
            edgesArray = [];

        let botId = null;

        function destroy() {
            if (network !== null) {
                console.log('network set to null!');
                network.destroy();
                network = null;
            }
        }
        destroy();

        function buildFlow(flow, rebuild) {
            nodesArray = [];
            edgesArray = [];

            const flowToBuild = param ? [...self.state.nodes] : [...flow];

            flow.forEach(function (node) {

                let color = "#E0E0E0";
                let level = null;

                if(node.parentId === null) {
                    color = "#F2994A";
                    level = 0;
                    botId = node.botId;
                } else if(node.type === "BUTTON") {
                    color = "#2D9CDB";
                }

                nodesArray.push({
                    id: node.id,
                    botId: node.botId,
                    widthConstraint: 200,
                    label: node.title,
                    parentId: node.parentId,
                    title: 'double click to edit',
                    color: color
                });
                edgesArray.push({from: node.parentId, to: node.id});

                if(rebuild) {
                    updateNetwork();
                } else {
                    nodes = new vis.DataSet(nodesArray);
                    edges = new vis.DataSet(edgesArray);
                }
            });

            self.setState({
                nodes: [...nodesArray]
            });
        }
        buildFlow(flow);

        // create a network
        let container = document.getElementById('flowDesigner');
        let data = {
            nodes: nodes,
            edges: edges
        };

        let options = {
            interaction: {
                dragNodes: false,
                hover: true,
                navigationButtons: true,
                keyboard: true
            },
            nodes: {
                shape: 'box',
                margin: 10,
                font: {
                    color: "#000000"
                },
                color: {
                    highlight: {
                        background: '#D78536'
                    },
                    hover: {
                        background: "#F2995E"
                    }
                }
            },
            edges: {
                color: {
                    color: "#BDBDBD"
                }
            },
            layout: {
                hierarchical: {
                    direction: "UD",
                    levelSeparation: 250,
                    nodeSpacing: 250,
                    sortMethod: 'directed'
                }
            },
            physics: false,
            manipulation: {
                enabled: false,
                initiallyActive: false
            }
        };
        network = new vis.Network(container, data, options);

        network.on("click", selectNode);
        network.on("doubleClick", getLabel);

        function selectNode(params) {
            selectedNode = params.nodes[0];
        }

        function getLabel(params) {
            selectedNode = editableNode = params.nodes[0];
            if (editableNode || editableNode === 0) {
                $('#messageInput').val(nodesArray[findNode(editableNode)].label);
            }
        }

        function ifStringEmpty(text) {
            return (text.length === 0 && !text.trim());
        }

        function updateNetwork() {
            nodes.clear();
            edges.clear();
            nodes.add(nodesArray);
            edges.add(edgesArray);
        }

        function saveLabel() {
            const label = msgInput.val();

            if ((editableNode || editableNode === 0) && (!ifStringEmpty(label))) {
                nodesArray[findNode(editableNode)].label = label;

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const data = {
                    "id": nodesArray[findNode(editableNode)].id,
                    "title": label
                };

                fetch('https://udigital.botscrew.com/edit-element', {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        // console.log('element edited', responseJson);
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                updateNetwork();
                $('#messageInput').val("");
            } else if (ifStringEmpty(label)) {
                alert('Title can not be empty');
            }

            selectedNode = editableNode = null;
        }

        function insertNode(selectedNode, elemId) {
            const modifyArray = nodesArray.filter(function (element) {
                return (element.parentId === selectedNode) && (element.id !== elemId);
            });

            const edgesToRemove = [];
            modifyArray.forEach(function (item) {
                const elem = edgesArray.filter(function (element) {
                    return ( (element.to === selectedNode) || (element.from === selectedNode) ) &&
                        ( (element.to === item.id) || (element.from === item.id) );
                })[0];

                edgesToRemove.push(elem);
            });

            edgesToRemove.forEach(function (item) {
                edgesArray.splice(findEdge(item.id), 1);
            });

            modifyArray.forEach(function (item) {
                nodesArray[findNode(item.id)].parentId = elemId;
                edgesArray.push({from: elemId, to: item.id});
            });
        }

        function addNode(type) {
            let typeColor,
                label = msgInput.val();

            if (type === "btn") {
                typeColor = "#2D9CDB";
                type = "BUTTON";
            } else if (type === "msg") {
                typeColor = "#E0E0E0";
                type = "MESSAGE";
            }

            if (selectedNode || selectedNode === 0) {
                const elemId = "tempID" + Math.floor((Math.random() * 100000) + 1);

                if (!ifStringEmpty(label)) {

                    nodesArray.push({
                        id: elemId,
                        widthConstraint: 200,
                        label: label,
                        color: typeColor,
                        type: type,
                        parentId: selectedNode,
                        title: 'double click to edit'
                    });

                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const data = {
                        "bot_id":botId,
                        "type":type,
                        "title": label,
                        "parent_flow_id": selectedNode,
                        "active":true
                    };

                    fetch('https://udigital.botscrew.com/create-element', {
                        method: 'POST',
                        headers: myHeaders,
                        credentials: 'same-origin',
                        body: JSON.stringify(data)
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {

                            nodesArray[findNode(elemId)].id = responseJson;

                            if(type === "MESSAGE") {

                                insertNode(selectedNode, responseJson);

                            } else if( (type === "BUTTON") && (findNodeIdByParentId(selectedNode) !== -1) ) {

                                 let msgChild = false;

                                 const childrenArr = nodesArray.filter(function (element) {
                                     if ( (element.parentId === selectedNode) && (element.type === "MESSAGE") ) {
                                         msgChild = true;
                                     }
                                     return element.parentId === selectedNode;
                                 });

                                 if(msgChild) {
                                     insertNode(selectedNode, responseJson);
                                 }

                            }

                            edgesArray.push({from: nodesArray[findNode(responseJson)].parentId, to: responseJson});

                            updateNetwork();

                            selectedNode = null;
                            $('#messageInput').val("");
                        })
                        .catch((error) => {
                            console.error(error);
                        });

                } else {
                    notifyModalShow("Message or button title can not be empty");
                }
            } else {
                notifyModalShow("Select parent element first!");
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
            const item = nodesArray.find(item => item.parentId === parentId);

            if (item !== undefined) {
                return item.id;
            }
            return -1;
        }

        function findNode(id) {
            const item = nodesArray.find(item => item.id === id);
            return nodesArray.indexOf(item);
        }

        function findEdge(id) {
            const item = edgesArray.find(item => item.id === id);
            return edgesArray.indexOf(item);
        }

        function deleteNode() {

            console.log(selectedNode);
            console.log(nodesArray);
            nodesArray = [];
            nodesArray = [...self.state.nodes];
            console.log(findNode(selectedNode));
            console.log(network.body.nodes);

            if (nodesArray[findNode(selectedNode)].parentId === null) {
                notifyModalShow("You are not allowed to remove root element!");
            } else if (selectedNode) {
                console.log(nodesArray);

                const data = {
                    "id": nodesArray[findNode(selectedNode)].id,
                    "botId": botId
                };

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                fetch('https://udigital.botscrew.com/delete-element', {
                    method: 'POST',
                    headers: myHeaders,
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {

                        notifyModalShow("Element(s) was successfully deleted.", "undo");
                        console.log(responseJson[1]);
                        console.log(responseJson[0]);

                        // deletedNodes = [...responseJson[0]];

                        self.setState({
                            deletedNodes: [...responseJson[0]]
                        });

                        buildFlow(responseJson[1], true);

                        // updateNetwork();
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            } else {
                alert("Select element you want to delete!");
            }
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

    undo() {
        const self = this;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch('https://udigital.botscrew.com/undo', {
            method: 'POST',
            headers: myHeaders,
            credentials: 'same-origin',
            body: JSON.stringify(this.state.deletedNodes)
        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);

                self.setState({
                    nodes: responseJson
                });

                console.log(self.state.nodes);

                self.draw(responseJson, true);

            })
            .catch((error) => {
                console.error(error);
            });
    }

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
                <NotifyModal undo={this.undo}/>
            </div>
        )
    }

}

export default FlowDesigner;
