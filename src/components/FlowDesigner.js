import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './FlowDesigner.css';

import $ from 'jquery';
import vis from 'vis';

class FlowDesigner extends Component {

    constructor() {
        super();
        this.botId = null;

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

    draw(flow) {
        const self = this;
        var msgInput = $('#messageInput');

        var nodes = null;
        var edges = null;
        var network = null;
        var selectedNode = null,
            editableNode = null;

        var deletedNodes = [],
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

        destroy();

        function buildFlow(flow) {
            nodes = [];
            edges = [];

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
                    widthConstraint: 150,
                    label: node.title,
                    parentId: node.parentId,
                    title: 'double click to edit',
                    color: color
                });

                // if(node.parentId !== null) {
                //     nodes[findNode(node.id)]["level"] = nodes[findNode(node.parentId)]["level"] + 1;
                // }

                edgesArray.push({from: node.parentId, to: node.id});

                nodes = new vis.DataSet(nodesArray);
                edges = new vis.DataSet(edgesArray);
                // nodes[findNode(node.id)]["level"] = level;
            });
        }
        buildFlow(flow);

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
            // data = {
            //     nodes: nodes,
            //     edges: edges
            // };
            //
            // console.log('Network updated');
            // console.log(nodes);
            //
            // network = new vis.Network(container, data, options);
            // network
            //     .on("click", selectNode)
            //     .on("doubleClick", getLabel);
            nodes.clear();
            edges.clear();
            nodes.add(nodesArray);
            edges.add(edgesArray);
        }

        function selectNode(params) {
            selectedNode = params.nodes[0];
//                console.log(network.body.data.nodes.length);
               console.log(network.body.data.nodes._data);
//                params.event = "[original event]";
//                document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);
//                console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
        }

        function getLabel(params) {
            selectedNode = editableNode = params.nodes[0];
            if (editableNode || editableNode === 0) {
                console.log(nodes);
                $('#messageInput').val(nodesArray[findNode(editableNode)].label);
            }
        }

        function saveLabel() {
            var label = msgInput.val();

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

        function addNode(type) {
            console.log('adding element');
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
                var elemId = "tempID" + Math.floor((Math.random() * 100000) + 1);
                // selectedNodeLevel = nodes[findNode(selectedNode)]["level"]

                if (!ifStringEmpty(label)) {
                    nodesArray.push({
                        id: elemId,
                        widthConstraint: 150,
                        label: label,
                        color: typeColor,
                        type: type,
                        parentId: selectedNode
                    });
                    // nodes[findNode(elemId)]["level"] = parseInt(selectedNodeLevel, 10) + 1;

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
                            // nodes[findNode(responseJson)]["level"] = parseInt(selectedNodeLevel, 10) + 1;
                            edgesArray.push({from: nodesArray[findNode(responseJson)].parentId, to: responseJson});
                            console.log(selectedNode);
                            console.log(responseJson);
                            updateNetwork();

                            selectedNode = null;
                            $('#messageInput').val("");
                        })
                        .catch((error) => {
                            console.error(error);
                        });

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
            var item = nodesArray.find(item => item.parentId === parentId);

            if (item !== undefined) {
                return item.id;
            }
            return -1;
        }

        function findNode(id) {
            var item = nodesArray.find(item => item.id === id);
            return nodesArray.indexOf(item);
        }

        function removeNode(id) {
            var nodeIndex = findNode(id);

            deletedNodes.push(nodesArray[nodeIndex]);
            nodesArray.splice(nodeIndex, 1);
        }

        function deleteNode() {
            deletedNodes.splice(0, deletedNodes.length);

            if (selectedNode) {
                console.log(selectedNode);
                console.log(nodesArray[findNode(selectedNode)].type);

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

                        console.log(responseJson);

                        buildFlow(responseJson);

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
