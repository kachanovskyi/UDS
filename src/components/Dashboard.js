import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'react-bootstrap';

import DashNumber from './DashNumber';

import './Dashboard.css';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            titles: ["Estadísticas hoy", "Estadísticas Mes", "Total"],
            stats: []
        };
    };

    loadData() {
        fetch('./dashboard.json')
            .then((response) => response.json())
            .then((responseJson) => {

                let stats = [];
                stats.push(responseJson.statistics.todayStats);
                stats.push(responseJson.statistics.monthStats);
                stats.push(responseJson.statistics.allStats);

                this.setState({
                    stats
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    transposeMatrix(array) {
        return array.map(function(col, i) {
            return array.map(function(row) {
                return row[i]
            })
        });
    }

    componentDidMount() {
        this.loadData();
    };

    render() {
        return (
            <div className="Dashboard">
                {this.state.titles.map((title, index) => (
                    <div className="row" key={index}>
                        <Col md={3}>
                            <h2 className="font_2">{title}</h2>
                        </Col>
                        {this.transposeMatrix(this.state.stats).map((stat, subIndex) => (
                            <Col md={3} key={subIndex}>
                                <DashNumber title={stat[subIndex].title} amount={stat[index].amount}/>
                            </Col>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

}

export default Dashboard;
