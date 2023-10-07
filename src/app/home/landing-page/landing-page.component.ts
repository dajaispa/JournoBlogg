import { Component, OnInit } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { PostService } from 'src/app/post/post.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit{
  landingPageTabs = ['Featured','Latest'];
  posts: any[];
  isPostLoaded = false;

  constructor(private postService: PostService, private alert: AlertService) {}

  ngOnInit(){
    this.postService.getPostsData().subscribe({
      next: (posts) => {
        this.postService.currentViewPost = posts[0];
        this.posts = posts;
        this.isPostLoaded = true;
      },
      error: errorMessage => {
        this.alert.openSnackBar(errorMessage,'error');
      }
    });
  }

  onToggleSideNav(){

  }
  
}
