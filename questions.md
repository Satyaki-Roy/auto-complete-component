## What is the difference between Component and PureComponent? Give an example where it might break my app.

### Component:
1. Doesn't implement the shouldComponentUpdate() method by default.
2. It re-renders whenever its parent re-renders, regardless of whether its props or state have changed.
3. If a component receives new props or updates its state, it will always trigger re-render.

### PureComponent:
1. Implements the shouldComponentUpdate() method with a shallow prop and state comparison.
2. It performs a shallow comparison of the current props and state with the next props and state. If there are no
changes detected, the component doesn't re-render.

### Example where it might break
If the props which is passed to a child component is an object and in parent component you are only modifying a
particular property inside that object and the child is using that property inside the render function, in this case 
the child component should re-render, but it will not re-render.


## Context + ShouldComponentUpdate might be dangerous. Why is that?

1. When the context value changes, it triggers re-renders for all components in the tree that are consumers of that context.
2. shouldComponentUpdate is a lifecycle method available in class components that allows you to control whether a component
should re-render when its props or state change.
3. Combining Context with shouldComponentUpdate can introduce complexity in debugging and understanding the flow of your
application. It might be challenging to predict when a component will re-render and when it won't, leading to unexpected
behavior.


## Describe 3 ways to pass information from a component to its PARENT.

1. Props: The most common way to pass information from a child to its parent is by invoking a function passed down as a
prop from the parent to the child component. 
2. Context: You can expose a function which will modify the state of a particular context, and this function can be used
by a child component and the state can be consumed by a parent component.
3. Using Redux 


## Give 2 ways to prevent components from re-rendering.

1. PureComponent for class components and React.memo for functional components.
2. When using hooks like useState, useEffect, or useCallback, ensure that they are only called when necessary.


## What is a fragment and why do we need it? Give an example where it might break my app.

Fragment is a Wrapper that allows you to group multiple elements together without adding extra nodes to the DOM.

Fragments do not render any DOM elements themselves, so they cannot directly receive CSS styles or classes. If you're
using CSS selectors or targeting specific elements within a component tree, using a fragment might interfere with your
styling logic.


## Give 3 examples of the HOC pattern.

1. withLoadingIndicator: A HOC that adds a loading indicator while data is being fetched from an API.
2. withAuthentication: A HOC that adds authentication logic to restrict access to certain routes or components.
3. withLogging: A HOC that logs component lifecycle events or user interactions for debugging purposes.


## What's the difference in handling exceptions in promises, callbacks and async...await?

1. In promises, you typically use .then() and .catch() methods to handle resolved or rejected promises, respectively.
2. async...await function, you can use try...catch blocks to handle any errors that occur during execution.
3. callbacks: When you are passing a callback function to an async function then the first argument is error and second argument is result.
```bash
// Callback function to handle the result
function handleData(error, data) {
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Data:', data);
  }
}

// Invoking the asynchronous function with the callback
fetchData(handleData);
```


## How many arguments does setState take and why is it async.

1. state: This argument specifies the new state values or updates to be applied to the current state.
2. callback (optional): An optional function that will be executed after the state has been updated.

### Why is it async.
React batches state updates for performance reasons. When you call setState, React schedules an update but doesn't
immediately apply it. Instead, it queues the state update and may batch multiple updates together for better performance.


## List the steps needed to migrate a Class to Function Component.

1. Convert Class Syntax to Function Syntax: Replace the class keyword with function or use arrow function syntax.
2. Remove this Keyword: Since function components don't have a context, you'll need to replace instances of this with the variable names directly.
3. State Handling: For managing state, use the useState hook provided by React. Initialize state variables using
useState and use array destructuring to access the state variable and its setter function.
4. Lifecycle Methods: Rewrite any lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount, etc.)
as appropriate hooks. For example, useEffect can replace componentDidMount, componentDidUpdate, and componentWillUnmount
in function components.
5. Context and Refs: If your class component uses context or refs, you may need to update the syntax to use hooks like useContext and useRef.
6. Render Method: Replace the render() method with a return statement in the function component to render JSX.
7. Prop Handling: There should be no changes needed for passing props. Simply use the props directly in the function component.


## List a few ways styles can be used with components.

1. Inline styles
```bash
<div style={{ color: 'red', fontSize: '16px' }}>Hello, world!</div>
```

2. external CSS file
```bash
import ./index.css
```

3. CSS Frameworks
   Utilizing CSS frameworks like Bootstrap, Material-UI, or Tailwind CSS

## How to render an HTML string coming from the server.

HTML string coming from the server can be rendered using dangerouslySetInnerHTML attribute.
However, it's important to note that using this attribute can expose your application to cross-site scripting (XSS)
attacks if the HTML string is not sanitized properly.
```bash
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```
