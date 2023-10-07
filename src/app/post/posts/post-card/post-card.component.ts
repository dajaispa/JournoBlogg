import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';
import { MatDialog } from '@angular/material/dialog';
import { Offcanvas } from 'bootstrap';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit{
  @Input() postsData: any[];
  @Input() isProfilePost? = false;
  @Input() myPosts? = false;
  @Input() myBookMarks? = false;
  @Output() dataChanged? = new EventEmitter<void>();
  @ViewChild('offcanvas') offcanvas: ElementRef;
  offCanvasComments: any;
  posts: any;
  deleteToolTip = '';
  postImages = [];
  postContent = [];
  postsLoaded = false;
  posts$: Observable<Post[]>;
  commentsLoaded = false;
  comments: any;
  currentCommentPostID: any;

  constructor(
    private router: Router,
    private alert: AlertService ,
    private postService: PostService, 
    private data: DataService,
    private dialog: MatDialog){}

  ngOnInit(): void {
    this.posts = [...this.postsData];
    if(this.postsData.length > 0){
      this.setPostCardContent();
      this.setDeleteToolTip();
    }
  }

  ngAfterViewInit() {
    const offcanvasElement = this.offcanvas.nativeElement;
    this.offCanvasComments = new Offcanvas(offcanvasElement);
  }


  setPostCardContent(){
    if(this.postsData.length > 0){
      for(let i=0; i<this.postsData.length; i++){
        let content = this.postsData[i]['description'];
        for(let j=0; j<content.length; j++){
          if((content[j]).hasOwnProperty('image')){
            this.postImages[i] = content[j]['image'];
          }
          if((content[j]).hasOwnProperty('content')){
            this.postContent[i] ? this.postContent[i] += content[j]['content'] : this.postContent[i] = content[j]['content'];
          }
        }
      }
      this.postsLoaded = true;
      console.log(this.postContent);
    }
  }

  onViewPost(post: any){
    this.postService.currentViewPost = post;
    this.router.navigate(['viewPost']);
  }

  onBookMark(post){
    console.log(post);
    this.data.addBookMark(post);
  }

  setDeleteToolTip(){
    if(this.myPosts){
      this.deleteToolTip = 'Delete Post';
    }
    else if(this.myBookMarks){
      this.deleteToolTip = 'Remove Post from Bookmarks';
    }
  }

  onRemove(post : any){
        if(this.myPosts){
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: 'Are you sure you want to delete this post?'
          });
          dialogRef.afterClosed().subscribe(result => {
          if (result) {
          this.data.deletePost(post).then(() => {
            this.alert.openSnackBar('Post deleted successfully', 'success');
            this.dataChanged.emit();
          }).catch((error) => {
            this.alert.openSnackBar(`Error deleting post: ${error}`, 'error');
          });
         }});
        }
        else if(this.myBookMarks){
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: 'Are you sure you want to remove bookmark?'
            });
            dialogRef.afterClosed().subscribe(result => {
             if(result){
                this.data.removeBookMark(post).then(() => {
                this.alert.openSnackBar('Post removed from bookmarks successfully', 'success');
                this.dataChanged.emit();
              }).catch((error) => {
                this.alert.openSnackBar(`Error deleting post: ${error}`, 'error');
              });}
            });
          }
      }

  onComment(post){
    console.log(post);
    this.commentsLoaded = false;
    this.data.loadComments(post.id).subscribe(comments => {
      console.log(comments);
      this.comments = comments;
      this.currentCommentPostID = post.id;
      this.commentsLoaded = true;
      this. offCanvasComments.show();
    });
  }

  onRefreshComments(){
    this.commentsLoaded = false;
    this.data.loadComments(this.currentCommentPostID).subscribe(comments => {
      console.log(comments);
      this.comments = comments;
      this.commentsLoaded = true;
    });
  }

  onLike(post){
    this.data.updateLikeCount(post);
  }
}
