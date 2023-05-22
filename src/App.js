import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Modal, Pagination, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    setPosts(response.data);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handlePaginationSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagSelect = (event) => {
    const tag = event.target.value;
    const isSelected = selectedTags.includes(tag);

    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredPosts = posts
    .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((post) => selectedTags.length === 0 || (post.tags && selectedTags.some((tag) => post.tags.includes(tag))));

  const pageCount = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(0, pageSize);

  return (
    <Container>
      <h1 className="mt-4">Блог</h1>
      <Row className="my-4">
        <Col md={4}>
          <Form.Label>Количество элементов на странице:</Form.Label>
          <Form.Select value={pageSize} onChange={handlePaginationSizeChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Фильтр по имени:</Form.Label>
          <Form.Control type="text" value={searchTerm} onChange={handleSearchTermChange} />
        </Col>
        <Col md={4}>
          <Form.Label>Фильтр по тегам:</Form.Label>
          <Form.Select multiple value={selectedTags} onChange={handleTagSelect}>
            <option value="tag1">Тег 1</option>
            <option value="tag2">Тег 2</option>
            <option value="tag3">Тег 3</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {paginatedPosts.map((post) => (
          <Col key={post.id} md={4} className="mb-4">
            <Card onClick={() => handlePostClick(post)}>
              <Card.Img variant="top" src={post.image} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">{post.type}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedPost && (
        <Modal show={selectedPost !== null} onHide={() => setSelectedPost(null)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPost.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedPost.body}</p>
          </Modal.Body>
        </Modal>
      )}
      <Pagination className="mt-4">
        {[...Array(pageCount)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index === 0}
            onClick={() => setPageSize((index + 1) * pageSize)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default App;
