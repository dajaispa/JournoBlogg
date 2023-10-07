import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-right-section',
  templateUrl: './right-section.component.html',
  styleUrls: ['./right-section.component.css']
})
export class RightSectionComponent implements OnInit{
  posts: any;
  tags = ['Tech', 'Well Being'];
  postImages = [];
  postContent = [];
  posts$: Observable<Post[]>;
  isPostLoaded = false;

  constructor(private router: Router, private alert: AlertService ,private postService: PostService, private data: DataService){}

  ngOnInit(){
    this.getPosts().subscribe({
      next: (posts: Post[]) => {
        this.postService.setTrendingPosts(posts);
        this.posts = this.postService.getTrendingPosts();
        //this.postService.currentViewPost = this.posts[0];
        this.isPostLoaded = true;
      },
      error: errorMessage => {
        this.alert.openSnackBar(errorMessage,'error');
      }
    });
  }

  getPosts(): Observable<Post[]> {
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

  onViewPost(post: any){
    this.postService.currentViewPost = post;
    this.router.navigate(['viewPost']);
  }

}
