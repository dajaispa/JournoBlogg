import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';
import { DataService } from '../shared/services/data.service';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts : Post[];
  private forYouPosts : Post[];
  private bookMarkedPosts : Post[];
  private trendingPosts : Post[];
  currentViewPost: Post;

  constructor(private data: DataService, private alert: AlertService) { }

  setPosts(posts: Post[]) {
    this.posts = posts;
  }

  getPosts() {
    return this.posts;
  }

  setbookMarkedPosts(posts: Post[]) {
    this.bookMarkedPosts = posts;
  }

  getbookMarkedPosts() {
    return this.bookMarkedPosts.slice();
  }

  setForYouPosts(posts: Post[]) {
    this.forYouPosts = posts;
  }

  getForYouPosts() {
    return this.forYouPosts.slice();
  }

  setTrendingPosts(posts: Post[]) {
    this.trendingPosts = [];
    const taken = new Set();
    const len = posts.length;
    if(posts.length >= 3 ){
      while(this.trendingPosts.length < 3){
        const randomIndex = Math.floor(Math.random() * len);
        if (!taken.has(randomIndex)) {
          taken.add(randomIndex);
          this.trendingPosts.push(posts[randomIndex]);
        }
      }
    }
    else{
      this.trendingPosts = posts;
    }
  }

  getTrendingPosts() {
    return this.trendingPosts;
  }

  getCurrentViewPost(): Post {
    return this.currentViewPost;
  }

  setCurrentViewPost(post: Post) {
    this.currentViewPost = post;
  }

  getPostsData(): Observable<Post[]> {
    return this.data.getPosts().pipe(
      map((res) =>
        res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
      )
    );
  }

}
