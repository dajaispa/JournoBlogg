import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { ProfileService } from '../profile.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditDialogComponent } from '../profile-edit-dialog/profile-edit-dialog.component';
import { Profile } from '../profile.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  title: string = '';
  bio: string = '';
  imgSrc: any;
  uid: any;
  profilePosts : any[];
  bookmarkPosts : any[];
  isBookMarkedPostsLoaded = false;
  isProfilePostsLoaded = false;


  constructor(
    private profileService: ProfileService, 
    private dataService: DataService, 
    public dialog: MatDialog
    ){}

  async ngOnInit(){
    await this.getPosts();
    //console.log(localStorage.getItem('userData')); // to store title
  }

  async getPosts(){
    this.dataService.getCurrentUserUID().subscribe(uid => {
      this.getProfile(uid);
    });
    const profilePostsPromise = this.dataService.getProfilePosts(this.uid);
    const profilePosts = await profilePostsPromise;
    profilePosts.subscribe(posts => {
       this.profilePosts = posts;
       this.isProfilePostsLoaded = true;
       console.log(this.profilePosts);
    });
    const bookmarkPostsPromise = this.dataService.getBookMarkedPosts(this.uid);
    const bookmarkPosts = await bookmarkPostsPromise;
    bookmarkPosts.subscribe(posts => {
       this.bookmarkPosts = posts;
       this.isBookMarkedPostsLoaded = true;
       console.log(this.bookmarkPosts);
    });
  }

  getProfile(uid){
    this.dataService.getProfile(uid).subscribe(profile => {
      console.log(profile);
      this.uid = uid;
      this.title = profile.name;
      this.bio = profile.bio;
      profile.profileImg ? this.imgSrc = profile.profileImg : this.imgSrc = 'assets/img/user.png';
    });
  }

  onEdit(): void {
    const dialogRef = this.dialog.open(ProfileEditDialogComponent, {
      hasBackdrop: false,
      width: '450px',
      data: {
        name: this.title,
        bio: this.bio,
        profileImg: this.imgSrc,
        uid: this.uid
      }
    });
    dialogRef.afterClosed().subscribe((isSaved) => {
      if(isSaved){
        this.getProfile(this.uid);
      }
    });
  }

  refreshData(){
     this.getPosts();
  }

  
}
