import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Post } from 'src/app/post/post.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { firstValueFrom, from, lastValueFrom, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(
    private alert: AlertService,
    private afAuth: AngularFireAuth,
    private afs : AngularFirestore
  ) {
  }

  getCurrentUserUID() {
    return this.afAuth.authState.pipe(
      map(user => user.uid)
    );
  }

  getPosts() {
    return this.afs.collection('/Posts').snapshotChanges();
  }

  updateProfile(uid: string, updatedProfile) {
    const profileDocRef = this.afs.collection('profiles').doc(uid);
    return from(profileDocRef.set(updatedProfile, { merge: true }));     
  }

    getProfile(uid: string): Observable<any> {
      const profileDoc: AngularFirestoreDocument<any> = this.afs.collection('/profiles').doc(uid);
      return profileDoc.snapshotChanges().pipe(
        map((changes) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        })
      );
    }

    async addBookMark(post: Post){
      const userId = (await this.afAuth.currentUser).uid;
      const profileDocRef = this.afs.collection('profiles').doc(userId);
      const postDocRef = this.afs.collection('Posts').doc(post.id);
      post.views += 1; 
      postDocRef.set(post, { merge: true });

      const bookMarkSubcollectionRef = profileDocRef.collection('bookmarks').doc(post.id);
      bookMarkSubcollectionRef.set(post);
    }

    async updateViewCount(post: Post){
      const postDocRef = this.afs.collection('Posts').doc(post.id);
      post.views += 1; 
      postDocRef.set(post, { merge: true });
      const profileDocRef = this.afs.collection('profiles').doc(post.profileID);
      const postSubcollectionRef = profileDocRef.collection('posts').doc(post.id);
      postSubcollectionRef.set(post, { merge: true });
    }

    async updateLikeCount(post: Post){
      const postDocRef = this.afs.collection('Posts').doc(post.id);
      post.likes += 1; 
      postDocRef.set(post, { merge: true });
      const profileDocRef = this.afs.collection('profiles').doc(post.profileID);
      const postSubcollectionRef = profileDocRef.collection('posts').doc(post.id);
      postSubcollectionRef.set(post, { merge: true });
    }

    async addPost(post: Post) {
      const userId = (await this.afAuth.currentUser).uid;
      const profileDocRef = this.afs.collection('profiles').doc(userId);
      const profileSnapshot = await profileDocRef.get();
      const profileSnap =  await lastValueFrom(profileSnapshot);
      const data = profileSnap.data();
      post.authorName = data['name'];
      post.authorProfileImg = data['profileImg'];
      post.profileID = userId;
      
      const postJSON = post.toJSON();
      const postDocRef = await this.afs.collection('/Posts').add(postJSON);
    
      const postSubcollectionRef = profileDocRef.collection('posts').doc(postDocRef.id);
      return postSubcollectionRef.set(postJSON);
    }

    async getProfilePosts(profileId?: any) {
      let userId: any;
      profileId ? userId = profileId : userId = (await this.afAuth.currentUser).uid;
      
      const profileDocRef = this.afs.collection('profiles').doc(userId);
  
      return profileDocRef.collection('posts').get().pipe(
        map(querySnapshot => {
          const posts = [];
          querySnapshot.forEach(doc => {
            const post = doc.data() as Post;
            post.id = doc.id;
            posts.push(post);
          });
          return posts;
        })
      );
    }

    async getBookMarkedPosts(profileId?: any) {
      let userId: any;
      profileId ? userId = profileId : userId = (await this.afAuth.currentUser).uid;
      
      const profileDocRef = this.afs.collection('profiles').doc(userId);
  
      return profileDocRef.collection('bookmarks').get().pipe(
        map(querySnapshot => {
          const posts = [];
          querySnapshot.forEach(doc => {
            const post = doc.data() as Post;
            post.id = doc.id;
            posts.push(post);
          });
          return posts;
        })
      );
    }

    async deletePost(post: Post) {
      // Delete post from Posts collection
      await this.afs.collection('Posts').doc(post.id).delete();
    
      // Delete post from profile subcollection
      const profileDocRef = this.afs.collection('profiles').doc(post.profileID);
      await profileDocRef.collection('posts').doc(post.id).delete();
    }

    async removeBookMark(post : Post){
      const userId = (await this.afAuth.currentUser).uid;
      const profileDocRef = this.afs.collection('profiles').doc(userId);
      await profileDocRef.collection('bookmarks').doc(post.id).delete();
    }

    loadComments(postId: string) {
      const postDoc = this.afs.collection('Posts').doc(postId);
      return postDoc.get().pipe(
        map(doc => {
            const data = doc.data();
            if (data['comments']) {
              return data['comments'];
            } else {
              return false;
            }
        })
      );
    }

    async addComment(commentText: string, postId: string) {
      const userId = (await this.afAuth.currentUser).uid;
      const date = new Date().toLocaleString();
      const comment = {
        profileImg: '',
        name : '',
        date : date,
        text: commentText
      };
      const profileRef = this.afs.collection('profiles').doc(userId);
      const profileDoc = await firstValueFrom(profileRef.get());
      const profile = profileDoc.data();
      comment.name = profile['name'];
      comment.profileImg = profile['profileImg'];
      
      const postRef = this.afs.collection('Posts').doc(postId);
      const postDoc = await firstValueFrom(postRef.get());
      const post = postDoc.data() as Post;
      const comments = post['comments'] || []; // get existing comments or initialize an empty array
      comments.push(comment); // add new comment to the array
      const newCommentsCount = (post['commentsCount'] || 0) + 1; 
      return postRef.update({ comments, commentsCount: newCommentsCount});
    }
}
