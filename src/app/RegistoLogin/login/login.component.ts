import {Component, HostBinding, OnInit} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../../router.animations';
import { AuthService } from '../../shared/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {regexValidators } from '../../shared/Validators/validators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../registo_style.css'],
  animations: [moveIn(), fallIn()],

})
export class LoginComponent implements OnInit {
  @HostBinding('@moveIn') moveIn;
  state = '';
  error: any;
  isLoadng=false;
  pbColor='red';
  pbMode='indeterminate';
  pbValue=100;
  btnStatus=false;
  form: FormGroup;
  email: FormControl;
  senha: FormControl;
  user = {email: '', senha: ''};

  private formSumitAttempt: boolean;

  validators= regexValidators;
  canCheckEmail=false;


  constructor(private formBuilder: FormBuilder,public afAuth: AngularFireAuth,public authS: AuthService,private router: Router) {
    this.authS.getAuthState().subscribe(user => {
      if(user) {
        this.router.navigateByUrl('/members');
      }
    });

  }

  onSubmit(form: FormGroup) {
    this.formSumitAttempt = true;
    if(this.form.valid) {
      this.showPb();
      this.afAuth.auth.signInWithEmailAndPassword(
        form.value.email,
        form.value.senha
      ).then(
        (success) => {
          console.log(success);
          this.router.navigate(['/members']);
          this.hidePb();
        }).catch(
        (err) => {
          console.log(err);
          this.error = err;
          this.isLoadng =false;
          this.hidePb();
        });
    }
  }

  ngOnInit():void {
    this.createFormsControls();
    this.authS.getAuthState().subscribe(user => {
      if(user) {
        this.router.navigateByUrl('/painelc/dashboard');
      }else {
        this.router.navigateByUrl('/login');
      }
    });
    this.form = new FormGroup({
      email: this.email,
      senha:this.senha
    });
  }
hideError(){
  this.error=null;
}

createFormsControls(){
  this.email= new FormControl (this.user.email,[ Validators.required,
    Validators.minLength(8), Validators.maxLength(80), Validators.pattern(this.validators.email)]);
    this.senha= new FormControl (this.user.senha,[ Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
}

showPb(){
  this.isLoadng=true;
}

hidePb(){
  this.isLoadng=false;
}

}
