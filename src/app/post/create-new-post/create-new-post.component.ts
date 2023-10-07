import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-new-post',
  templateUrl: './create-new-post.component.html',
  styleUrls: ['./create-new-post.component.css']
})
export class CreateNewPostComponent implements OnInit{
  @ViewChild('selectFile') selectFile: ElementRef;
  form: FormGroup;
  preview: string;
  title = new FormControl();
  addOnBlur = true;
  isUpLoading = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];
  isContentAdded = false;
  post = new Post('','',null,null,[],0, 0, [], 0, [], new Date());

  get formControls() {
    return (this.form.get('fields') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder, 
    private dataService: DataService, 
    private alertService: AlertService,
    private router: Router, 
    private postService: PostService,
    private storage: AngularFireStorage) {
    this.form = this.fb.group({
      fields: this.fb.array([])
    });
  }

  ngOnInit(){
  }
  

  addField(fieldType: string) {
    let formControl: FormControl;

    switch (fieldType) {
      case 'header':
        formControl = new FormControl('');
        break;
      case 'content':
        formControl = new FormControl('', Validators.required);
        this.isContentAdded = true;
        break;
      case 'image':
        formControl = new FormControl('');
        break;
      default:
        formControl = new FormControl('');
        break;
    }

    (<FormArray>this.form.get('fields')).push(
      new FormGroup({
        [fieldType] : formControl
      })
    );
    this.form.updateValueAndValidity();
  }
  
  onFileSelect(event: any, index: number) {
    this.isUpLoading = true;
    const file = (event.target as HTMLInputElement).files[0] as File;
    const filePath = `images/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            const description = [...this.form.value.fields];
            description[index] = { image: url };
            this.form.controls['fields'].setValue(description);
            this.isUpLoading = false;
          });
        })
      )
      .subscribe();
      
  
    (event.target as HTMLInputElement).value = '';
    // const file = (event.target as HTMLInputElement).files[0] as File;
    // const reader = new FileReader();
  
    // reader.onload = () => {
    //   this.preview = reader.result as string;
    //   this.formControls[index].get('image').setValue(this.preview);
    // };
  
    // reader.readAsDataURL(file);
    // (event.target as HTMLInputElement).value = '';
  }

  
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: any, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.isUpLoading = true;

    const file = event.dataTransfer.files[0] as File;
    const filePath = `images/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log(url);
            this.isUpLoading = false;
            this.preview = url; // Set the preview to the download URL
            this.formControls[index].get('image').setValue(url);
          });
        })
      )
      .subscribe();
  
    // const file = event.dataTransfer.files[0] as File;
    // const reader = new FileReader();
  
    // this.preview = ' '; // Set preview to an empty string to avoid the error with setting value property
  
    // reader.onload = () => {
    //   this.preview = reader.result as string;
    //   this.formControls[index].get('image').setValue(this.preview);
    // };
    // reader.readAsDataURL(file);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(tag);
      return;
    }
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = value;
    }
  }

  onPublish(){
    if(this.form.valid  && this.isContentAdded){
      this.post.title = this.title.value;
      this.post.tags = this.tags;
      this.post.description = [...this.form.value.fields];
      console.log(this.post);
      this.dataService.addPost(this.post).then(res => {
          this.postService.currentViewPost = this.post;
          this.router.navigate(['viewPost']);
          this.alertService.openSnackBar('Article Published!','success');
        })
        .catch( (error)  => {
          this.alertService.openSnackBar(error,'error');
        });
      };
      console.log(this.form.value.fields);
    }
  }


