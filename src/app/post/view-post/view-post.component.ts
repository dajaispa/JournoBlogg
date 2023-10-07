import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit{
   post: Post;
   postLoaded=false;
   profilePosts: any[];
   isProfilePostsLoaded = false;
   bio: any;

   constructor(private postService: PostService, private dataService: DataService, private router: Router){}

   async ngOnInit(){
    this.post = this.postService.currentViewPost;
    if(this.post){
      this.postLoaded=true;
      this.dataService.updateViewCount(this.post);
      this.getProfile(this.post.profileID);
      const profilePostsPromise = this.dataService.getProfilePosts(this.post.profileID);
      const profilePosts = await profilePostsPromise;
      profilePosts.subscribe(posts => {
        this.profilePosts = posts;
        this.isProfilePostsLoaded = true;
        console.log(this.profilePosts);
      });
    }
    else{
      this.router.navigate(['home']);
    }
    //console.log(Object.keys(this.post.description[0]));
   }

   getProfile(uid){
    this.dataService.getProfile(uid).subscribe(profile => {
      this.bio = profile.bio;
    });
  }

   getKey(content){
    //console.log((Object.keys(content))[0]);
    return (Object.keys(content))[0];
   }

   originalOrder() {
    return 0;
  }

  onViewPost(post: any){
    console.log(post);
    this.postService.currentViewPost = post;
    this.post = post;
  }
}
