import React from 'react';
import { Item } from './List';
import {
    render,
    screen,
    fireEvent,
  } from '@testing-library/react';

  const story = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Richie',
    num_comments: 3,
    points: 4,
    objectID: 0
  };

describe('Item component', () => {

    test('renders all properties', () => {
  
      // When: the component is rendered
      render(<Item item={story} />);
  
      // Then: the dom should have the following elements 
      expect(screen.getByText('Author: Richie')).toBeInTheDocument();
      expect(screen.getByText('React')).toHaveAttribute('href', "https://reactjs.org/");
  
    });
  
    test('renders a clickable remove button', () => {
  
      // When: the component is rendered
      render(<Item item={story} />);
  
      // Then: the dom should have the following elements 
      expect(screen.getByRole('button')).toBeInTheDocument();
  
    });
  
    test('clicking the remove button calls the callback handler', () => {
  
      // Given: the component is rendered
      const handleRemoveItem = jest.fn();
      render(<Item item={story} onRemoveItem={handleRemoveItem} />);
  
      // When: the button is clicked
      fireEvent.click(screen.getByRole('button'));
  
      // Then: the dom should have the following elements 
      expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  
    });
  
  });