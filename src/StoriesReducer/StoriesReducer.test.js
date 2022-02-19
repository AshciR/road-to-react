import storiesReducer from "./StoriesReducer";

const initialState = {
    data: [],
    isLoading: false,
    isError: false
};

const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Richie',
    num_comments: 3,
    points: 4,
    objectID: 0
};

const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Ashcir',
    num_comments: 2,
    points: 5,
    objectID: 1
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {

    test('init fetching stories', () => {

        // Given: We have a current state and an action
        const state = initialState
        const action = { type: 'STORIES_FETCH_INIT' };

        // When: We call the reducer
        const updatedState = storiesReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState = {
            data: [],
            isLoading: true,
            isError: false
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('fetch stories successfully', () => {

        // Given: We have a current state and an action
        const state = initialState
        const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };

        // When: We call the reducer
        const updatedState = storiesReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState = {
            data: stories,
            isLoading: false,
            isError: false
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('removes a story from all stories', () => {

        // Given: We have a current state and an action
        const state = { data: stories, isLoading: false, isError: false };
        const action = { type: 'REMOVE_STORY', payload: storyOne };

        // When: We call the reducer
        const updatedState = storiesReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState = {
            data: [storyTwo],
            isLoading: false,
            isError: false
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

    test('fetch stories failure', () => {

        // Given: We have a current state and an action
        const state = initialState
        const action = { type: 'STORIES_FETCH_FAILURE' };

        // When: We call the reducer
        const updatedState = storiesReducer(state, action);

        // Then: The expected state should be produdced
        const expectedState = {
            data: [],
            isLoading: false,
            isError: true
        };

        expect(updatedState).toStrictEqual(expectedState);

    });

});