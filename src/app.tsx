import {
  For,
  Suspense,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
} from 'solid-js';
import './app.css';
import { fetchPoem } from './poem';

interface LineIteratorProps {
  source?: AsyncGenerator<string>;
}

function LineIterator(props: LineIteratorProps) {
  const [items, setItems] = createSignal<string[]>([]);

  createEffect(() => {
    const currentSource = props.source;
    console.log('source', currentSource);
    if (currentSource) {
      setItems([]);
      (async () => {
        for await (const line of currentSource) {
          console.log('current', line);
          setItems(current => [...current, line]);
        }
      })();
    }
  });

  return (
    <For each={items()}>{item => <span class="poem-line">{item}</span>}</For>
  );
}

export default function App() {
  const [track, setTrack] = createSignal();
  const [data] = createResource(track, fetchPoem);

  function start() {
    setTrack({});
  }

  const [count, setCount] = createSignal(0);

  createEffect(() => {
    const timeout = setInterval(() => setCount(c => c + 1), 1000);
    onCleanup(() => clearTimeout(timeout));
  });

  return (
    <div>
      <h1>Count: {count()}</h1>
      <h1>tests</h1>
      <main class="poem">
        <div class="poem-header">
          <h1 class="poem-title">The Raven</h1>
          <span class="poem-sub">By: Edgar Allan Poe</span>
          <button type="button" onClick={start}>
            Start
          </button>
        </div>
        <div class="poem-body">
          <Suspense>
            <LineIterator source={data()} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
