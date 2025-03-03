import logo from "./leaf.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to Unichan</h1>
        <NavLinks />
      </header>
      <main>
        <BoardTable />
      </main>
    </div>
  );
}

function NavLinks() {
  return (
    <div className="nav-links">
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy</a>
      <a href="https://github.com/rare-sight/UniChan" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  );
}

function BoardTable() {
  const boards = [
    { name: "Technology", short: "tech", description: "Discussion about technology" },
    { name: "Video Games", short: "vg", description: "Talk about games" },
    { name: "Anime", short: "a", description: "Anime and manga discussions" },
    { name: "Random", short: "b", description: "The chaotic board" },
  ];

  return (
    <table className="board-table">
      <thead>
        <tr>
          <th>Board</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {boards.map((board, index) => (
          <tr key={index}>
            <td>
              <a href={`/${board.short}`}>/{board.short}/</a>
            </td>
            <td>{board.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;