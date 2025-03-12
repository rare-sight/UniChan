package com.UniChan.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.UniChan.store.model.Post;
import com.UniChan.store.repository.PostRepository;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post createPost(String userId, String content) {
        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setTimestamp(LocalDateTime.now()); // Now it works!
        return postRepository.save(post);
    }
}
