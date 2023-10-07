import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-profile-edit-dialog',
  templateUrl: './profile-edit-dialog.component.html',
  styleUrls: ['./profile-edit-dialog.component.css']
})
export class ProfileEditDialogComponent implements OnInit{
  profile: any;
  selectedFile: File = null;
  imageUrl: string = null;
  isUpLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ProfileEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private alert: AlertService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(){
     this.profile = {...this.data};
     this.profile.profileImg == "assets/img/user.png" ? this.imageUrl = null : this.imageUrl = this.profile.profileImg;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpload() {
    const fileInput: any = document.getElementById('fileInput');
    fileInput.click();
  }

  onFileSelected(event) {
    this.isUpLoading = true;
    this.selectedFile = event.target.files[0];
    const filePath = `images/${new Date().getTime()}_${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);
  
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
           this.profile.profileImg = url;
           this.imageUrl = url;
           this.isUpLoading = false;
          });
        })
      )
      .subscribe();
  }

  onRemove() {
    if (this.imageUrl) {
      this.isUpLoading = true;
      const fileRef = this.storage.refFromURL(this.imageUrl);
      fileRef.delete().subscribe(() => {
        this.selectedFile = null;
        this.imageUrl = null;
        this.profile.profileImg = "assets/img/user.png";
        const fileInput: any = document.getElementById('fileInput');
        fileInput.value = null;
        this.isUpLoading = false;
      });
    }
  }

  onSave(){ 
    const obs = this.dataService.updateProfile(this.data.uid, this.profile);
    obs.subscribe({
      next: res => {
        this.dialogRef.close(true);
        this.alert.openSnackBar('Profile updated successfully','success');
      },
       error: err => {
        this.alert.openSnackBar('Error Updating Profile!','error');
       }
    }
    );
  }
  
}
