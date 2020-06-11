import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddfriendPage } from './addfriend.page';

describe('AddfriendPage', () => {
  let component: AddfriendPage;
  let fixture: ComponentFixture<AddfriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfriendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddfriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
