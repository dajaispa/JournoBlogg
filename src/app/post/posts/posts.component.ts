import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{
  @Input() tabs: string[];
  @Input() posts: any[];
  @Input() bookmarkPosts: any[];
  @Output() dataChanged? = new EventEmitter<void>();

  ngOnInit(): void {
    console.log(this.posts);
  }

  onRefresh(){
    this.dataChanged.emit();
  }
}
