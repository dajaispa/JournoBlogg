import { User } from "../auth/user.model";
import { Post } from "../post/post.model";

export class Profile {
    public name: string;
    public email: string;
    public profileImg: any;
    public bio: string;
    public posts: Post[];
    public bookmarks: Post[]

    constructor(
      name: string,
      email: string,
      profileImg: any,
      bio: string
    ) {
        this.name = name;
        this.email = email;
        this.profileImg = profileImg;
        this.bio = bio;
    }

    toJSON() {
      return {
        name : this.name,
        email: this.email,
        profileImg : this.profileImg,
        bio : this.bio
      };
    }

   
  }
  