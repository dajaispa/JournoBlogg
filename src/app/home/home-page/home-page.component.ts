import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { PostService } from 'src/app/post/post.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent{
  mode: MatDrawerMode = 'side';
  opened = true;
  homePageTabs = ['For You', 'Featured'];
  posts: any[];
  bookmarkPosts : any[];
  isPostLoaded = false;
  isBookMarkedPostsLoaded = false;

  constructor(public postService: PostService, private alert: AlertService, private dataService: DataService) {}

  async ngOnInit(){
    await this.getPosts();
  }

  async getPosts(){
    this.postService.getPostsData().subscribe({
      next: (posts) => {
        this.postService.currentViewPost = posts[0];
        this.posts = posts;
        this.isPostLoaded = true;
        //this.loadBookmarks();
      },
      error: errorMessage => {
        this.alert.openSnackBar(errorMessage,'error');
      }
    });
    console.log(this.posts);
  }

  // async loadBookmarks(){
  //   const profilePostsPromise = this.dataService.getBookMarkedPosts();
  //     const profilePosts = await profilePostsPromise;
  //     profilePosts.subscribe(posts => {
  //       this.bookmarkPosts = posts;
  //       this.isBookMarkedPostsLoaded = true;
  //     });
  // }

  onRefresh(){
    this.getPosts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      // code to refresh data
      this.onRefresh();
    }
  }

  onToggleSideNav(){

  }
  
}
