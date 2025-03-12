import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import leaf from "./leaf.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={leaf} className="App-logo" alt="logo" />
          <h1>Welcome to Unichan</h1>
          <NavLinks />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<BoardTable />} />
            <Route path="/:board" element={<BoardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLinks() {
  return (
    <div className="nav-links">
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/privacy">Privacy</Link>
      <a href="https://github.com/rare-sight/UniChan" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
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
              <Link to={`/${board.short}`}>/{board.short}/</Link>
            </td>
            <td>{board.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BoardPage() {
  const { board } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/posts/${board}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [board]);

  const handlePost = () => {
    if (!newPost.trim() && !image) {
      alert("Post must have content or an image!");
      return;
    }

    const formData = new FormData();
    formData.append("board", board);
    formData.append("content", newPost);
    if (image) formData.append("image", image);

    fetch("http://localhost:8080/posts", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((post) => {
        setPosts([...posts, post]);
        setNewPost("");
        setImage(null);
        document.getElementById("fileInput").value = ""; // Reset file input
      })
      .catch((error) => console.error("Error posting:", error));
  };

  const handleDelete = (postId) => {
    fetch(`http://localhost:8080/posts/${postId}`, {
      method: "DELETE",
    })
      .then(() => setPosts(posts.filter((post) => post.id !== postId)))
      .catch((error) => console.error("Error deleting post:", error));
  };

  return (
    <div>
      <h2>/{board}/ Board</h2>
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Write your post..."
      ></textarea>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={handlePost}>Post</button>

      {posts.map((post) => (
        <div key={post.id} className="post">
          <p>{post.content}</p>
          {post.image && (
            <img
              src={`data:image/png;base64,${post.image}`}
              alt="Post"
              style={{ maxWidth: "300px" }}
              onError={(e) => {
                e.target.src = ""; // Hide broken images
                console.error("Error loading image:", post.image);
              }}
            />
          )}
          <button onClick={() => alert("Reply feature coming soon!")}>Reply</button>
          <button onClick={() => handleDelete(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
