export class Post {
  public id: any;
  public title: string;
  public authorName: string;
  public authorProfileImg: any;
  public profileID: string;
  public description: any;
  public likes: number;
  public commentsCount: number;
  public comments: any[];
  public views: number;
  public tags: string[];
  public postDate: any; 
  

  constructor( 
        title: string = '',
        authorName: string = '',
        authorProfileImg: any = null,
        profileID: string = null, 
        description: any = [],
        likes: number = 0,
        commentsCount: number = 0,
        comments: any[] = [],
        views: number = 0,
        tags: string[],
        postDate: any = new Date())
    {
        this.title = title;
        this.authorName = authorName;
        this.authorProfileImg = authorProfileImg;
        this.profileID = profileID;
        this.description = description;
        this.likes = likes;
        this.commentsCount = commentsCount;
        this.comments = comments;
        this.views = views;
        this.tags = tags;
        this.postDate = postDate; 
    }

    toJSON() {
        return {
            title : this.title,
            authorName : this.authorName,
            authorProfileImg: this.authorProfileImg,
            profileID: this.profileID,
            description : this.description,
            likes : this.likes,
            commentsCount : this.commentsCount,
            comments: this.comments,
            views: this.views,
            tags : this.tags,
            postDate : this.postDate
        };
      }
}