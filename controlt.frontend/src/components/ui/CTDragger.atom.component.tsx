import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import { DropResult } from 'react-beautiful-dnd';
import DraggableList from './components/DraggableList';
import pick from '@cahil/utils/accessors/pick';
import { getItems, reorder } from './helpers';
import './styles.css';

const useStyles = makeStyles({
    flexPaper: {
        flex: 1,
        margin: 16,
        minWidth: 350
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    }
});

const App = () => {
    const classes = useStyles();
    const [items, setItems] = React.useState(getItems(10));

    const onDragEnd = ({ destination, source }: DropResult) => {
        // dropped outside the list
        if (!destination) return;

        const newItems = reorder(items, source.index, destination.index);

        setItems(newItems);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.flexPaper}>
                <DraggableList items={items} onDragEnd={onDragEnd} />
            </Paper>
            <Paper className={classes.flexPaper}>
                <pre>
                    {JSON.stringify(
                        items.map(item => pick(item, 'id', 'primary')),
                        null,
                        2
                    )}
                </pre>
            </Paper>
        </div>
    );
};

export default App;
