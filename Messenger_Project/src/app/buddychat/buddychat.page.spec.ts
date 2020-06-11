import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuddychatPage } from './buddychat.page';

describe('BuddychatPage', () => {
  let component: BuddychatPage;
  let fixture: ComponentFixture<BuddychatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuddychatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuddychatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
