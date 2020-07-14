import React, {Fragment} from "react";
import List from '@material-ui/core/List';
import Event from "./Event";

export default class EventList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let eventComponents;
        if (this.props.events.length > 0) {
            eventComponents = this.props.events.map((x, i) =>
                <Event key={x.id} data={x} onFinish={this.props.handleFinish} onExtend={this.props.handleExtend} colorChange={!!(i % 2)}/>
            )
        } else {
            let data = {
                id: '1',
                htmlLink: 'noEvent',
                summary: 'Нет задач',
                start: {
                    dateTime: this.props.date
                },
                end: {
                    dateTime: this.props.date
                },
                organizer: {
                        email: 'noEmail'
                    },
            };

            eventComponents = <Event key={0} data={data} onFinish={() => {
            }} colorChange={!!(0 % 2)}/>;
        }
        return (
            <Fragment>
                <List>
                    {eventComponents}
                </List>
            </Fragment>
        )
    }
}


