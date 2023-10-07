import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.css']
})
export class CommentsDialogComponent implements OnInit{
  @Input() comments: any;
  @Input() postID: any;
  @Output() dataChanged? = new EventEmitter<void>();
  newComment = '';
  isCommentsEmpty = false;

  constructor(private data: DataService) {}

  ngOnInit(): void {
    if(!this.comments){
      this.isCommentsEmpty = true;
    }
  }

  updateAddButton(){

  }

  onAdd(){
    this.data.addComment(this.newComment, this.postID).then(() => {
      console.log('Comment added successfully!');
      this.dataChanged.emit();
    }).catch(error => {
      console.log('Error adding comment:', error);
    });
  }

  onCancel(){

  }

}
