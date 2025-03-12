package com.UniChan.store.controller;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.UniChan.store.model.Post;
import com.UniChan.store.repository.PostRepository;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend communication
public class PostController {
    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Get all posts from a specific board
    @GetMapping("/{board}")
    public ResponseEntity<List<Post>> getPostsByBoard(@PathVariable String board) {
        List<Post> posts = postRepository.findByBoard(board);
        return ResponseEntity.ok(posts);
    }

    // Create a new post with optional image
    @PostMapping(consumes = "multipart/form-data") // Fix: Ensure correct content type
    public ResponseEntity<?> createPost(
        @RequestParam("board") String board,
        @RequestParam("content") String content,
        @RequestPart(value = "image", required = false) MultipartFile image, // Fix: Use @RequestPart
        HttpServletRequest request
    ) {
        try {
            String ip = request.getRemoteAddr();
            String userId = UUID.nameUUIDFromBytes(ip.getBytes()).toString(); // Generate user ID based on IP

            Post post = new Post();
            post.setBoard(board);
            post.setContent(content);
            post.setUserId(userId);

            // Convert image to Base64 if present
            if (image != null && !image.isEmpty()) {
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                post.setImage(base64Image);
            }

            Post savedPost = postRepository.save(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image");
        }
    }

    // Delete a post by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.ok("Post deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found with ID: " + id);
        }
    }
}
