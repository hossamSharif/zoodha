import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveMzadPage } from './live-mzad.page';
import { of } from 'rxjs/internal/observable/of';

// describe('LiveMzadPage', () => {
//   let component: LiveMzadPage;
//   let fixture: ComponentFixture<LiveMzadPage>;

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [ LiveMzadPage ],
//       imports: [IonicModule.forRoot()]
//     }).compileComponents();

//     fixture = TestBed.createComponent(LiveMzadPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }));

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

  

// });
describe('LiveMzadPage', () => {

  let component: LiveMzadPage;
  let fixture: ComponentFixture<LiveMzadPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LiveMzadPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();
  }));

  it('should create the component', () => {
    fixture = TestBed.createComponent(LiveMzadPage);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call getAuction() when auction id is passed in route params', () => {
    const route = {
      queryParams: of({
        id: '123'
      })
    };
    const component = new LiveMzadPage(null, null, route, null, null, null, null, null);
    spyOn(component, 'getAuction');
    component.ngOnInit();
    expect(component.getAuction).toHaveBeenCalled();
  });

  it('should format string when calling tirmString()', () => {
    //const component = new LiveMzadPage(null, null, null, null, null, null, null, null);
    const result = component.tirmString('Hello World', 5);
    expect(result).toBe('Hello...');
  });

  it('should handle socket userJoinedAuction event', () => {
    const socket = jasmine.createSpyObj('SocketService', ['userJoinedAuction']);
    socket.userJoinedAuction.and.returnValue(of([{  name: 'User 1 ' }]));
   // const component = new LiveMzadPage(null, socket, null, null, null, null, null, null);
    component.ngOnInit();
    expect(component.users.length).toBe(1);
  });

});


it('should create', () => {
  expect(component).toBeTruthy();
});

it('should initialize variables on init', () => {
  component.ngOnInit();

  expect(component.showMore).toBe(false);
  expect(component.emptyLog).toBe(false);
  expect(component.errorLoad).toBe(false);
  expect(component.roundsMode).toBeTruthy();
  expect(component.availRounds).toBe(0);
  expect(component.highestBidd).toBe(0);
  expect(component.lastBidd4U).toBe(0);
  expect(component.bidPrice).toBeUndefined();
  expect(component.showMe).toBe(false);
  expect(component.users.length).toBe(0);
  expect(component.usersLogs.length).toBe(0);
  expect(component.termsArr.length).toBe(0);
  expect(component.view).toBeUndefined();
  expect(component.viewTerms).toBeUndefined();
  expect(component.showError).toBe(false);
  expect(component.msgError).toBe('');
});

it('should handle socket events', () => {
  // Mock socket service
  const socketService = jasmine.createSpyObj('SocketService', ['on']);

  component.socket = socketService;

  // Emit sample socket events
  const sampleBidEvent = { bid: 1000 };
  socketService.on.calls.first().args[1](sampleBidEvent);

  const sampleErrorEvent = 'Error message';
  socketService.on.calls.mostRecent().args[1](sampleErrorEvent);

  // Verify handling logic
  expect(component.highestBidd).toBe(1000);
  expect(component.showError).toBe(true);
  expect(component.msgError).toBe('Error message');
});

it('should navigate on button click', () => {
  // Mock router
  const router = jasmine.createSpyObj('Router', ['navigate']);
  component.rout = router;

  // Click button
  component.goToSub();

    // Verify navigation
    expect(router.navigate).toHaveBeenCalledWith(['mzad-subescribe']);
  });

   
