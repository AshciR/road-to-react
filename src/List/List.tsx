
import React from 'react';
import { ReactComponent as Check } from './check.svg';
import { Stories, Story } from '../Story';
import './List.css';

type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
};

const List = ({ list, onRemoveItem }: ListProps) => (
    <>
        {
            list.map(item => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))
        }
    </>
);

type ItemProps = {
    item: Story;
    onRemoveItem: (item: Story) => void;
};

const Item = ({ item, onRemoveItem }: ItemProps) => (
    <div className='item'>
        <span>Id: {item.objectID} </span>
        <span>
            <a href={item.url}> {item.title} </a>
        </span>
        <span>Author: {item.author} </span>
        <span>Number of comments: {item.num_comments} </span>
        <span>Points: {item.points} </span>
        <span>
            <button
                type="button"
                onClick={() => onRemoveItem(item)}
                className='button button--small'
            >
                <Check
                    height="18px"
                    width="18px"
                    data-testid='dimiss-check-box'
                />
            </button>
        </span>
    </div>
);

export default List;
export { Item };