import { Stories, Story } from "../Story";

type StoriesState = {
    data: Stories;
    isLoading: boolean;
    isError: boolean;
  };
  
  interface StoriesFetchInitAction {
    type: 'STORIES_FETCH_INIT';
  };
  
  interface StoriesFetchSuccessAction {
    type: 'STORIES_FETCH_SUCCESS';
    payload: Stories;
  };
  
  interface StoriesFetchFailureAction {
    type: 'STORIES_FETCH_FAILURE';
  };
  
  interface StoriesRemoveAction {
    type: 'REMOVE_STORY';
    payload: Story;
  };
  
  type StoriesAction =
    | StoriesFetchInitAction
    | StoriesFetchSuccessAction
    | StoriesFetchFailureAction
    | StoriesRemoveAction
  
  const storiesReducer = (
    state: StoriesState,
    action: StoriesAction
  ) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(stories => action.payload.objectID !== stories.objectID)
        };
      default:
        throw new Error();
    }
  };

  export default storiesReducer;