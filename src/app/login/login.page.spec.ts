import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  
});






describe('LoginPage', () => {

  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loginPhone', () => {
    it('should call loginPhone api on valid form', () => {
      component.ionicForm.controls['phone'].setValue('1234567890');
      component.loginPhone();
      expect(component.api.loginPhone).toHaveBeenCalledWith('1234567890', jasmine.any(String));
    });

    it('should show error toast on invalid phone number', () => {
      component.ionicForm.controls['phone'].setValue('123');
      component.loginPhone();
      expect(component.presentToast).toHaveBeenCalledWith(jasmine.any(String), 'danger');
    });

  });

  describe('loginEmail', () => {
    it('should call loginEmail api on valid form', () => {
      component.ionic2Form.controls['email'].setValue('test@example.com');
      component.ionic2Form.controls['password'].setValue('testpass');
      component.loginEmail();
      expect(component.api.loginEmail).toHaveBeenCalledWith('test@example.com', 'testpass');
    });

    it('should show error toast on invalid email', () => {
      component.ionic2Form.controls['email'].setValue('invalid');
      component.loginEmail();
      expect(component.presentToast).toHaveBeenCalledWith(jasmine.any(String), 'danger');
    });

  });

  describe('handleError', () => {
    it('should handle no user found error', () => {
      const error = { error: 'No user with this phone found' };
      component.handleError(error);
      expect(component.presentToast).toHaveBeenCalledWith(jasmine.any(String), 'danger');
    });

    it('should handle invalid login error', () => {
      component.handleError({});
      expect(component.presentToast).toHaveBeenCalledWith(jasmine.any(String), 'danger');
    });
  });

});

