import '@testing-library/jest-dom';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
    Droppable: ({ children }) => children({
        draggableProps: {
            style: {},
        },
        innerRef: jest.fn(),
    }, {}),
    Draggable: ({ children }) => children({
        draggableProps: {
            style: {},
        },
        innerRef: jest.fn(),
        dragHandleProps: {},
    }, {}),
    DragDropContext: ({ children }) => children,
}));

// Mock environment variables
process.env.VITE_API_URL = 'http://localhost:3000';