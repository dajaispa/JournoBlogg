import { Injectable } from '@angular/core';
import { Profile } from './profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profile : Profile;

  setProfile(profile: Profile) {
    this.profile = profile;
  }

  getProfile() {
    return this.profile;
  }
  
}
