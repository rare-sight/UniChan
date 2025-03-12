package com.UniChan.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.UniChan.store.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByBoard(String board); // Existing method
    List<Post> findByUserId(String userId); // Add this method
}
