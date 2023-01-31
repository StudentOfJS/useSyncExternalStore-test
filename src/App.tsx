import reactLogo from './assets/react.svg';
import './App.css';
import createStoreContext from './createStoreContext';

const { Provider, useStore } = createStoreContext(
  {
    count: 0,
    title: 'Context test',
  },
  'sessionStorage'
);

function App() {
  return (
    <Provider>
      <div className="App">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <DisplayTitle />
        <div className="card">
          <DisplayCount />
          <UpdateCount />
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </Provider>
  );
}

export default App;

function UpdateCount() {
  const [count, setStore] = useStore((store) => store.count);
  return (
    <button onClick={() => setStore({ count: count + 1 })}>
      increase count
    </button>
  );
}

function DisplayCount() {
  const [count] = useStore((store) => store.count);
  return <h2>count is {count}</h2>;
}

function DisplayTitle() {
  const [title] = useStore((store) => store.title);
  return <h1>{title}</h1>;
}
