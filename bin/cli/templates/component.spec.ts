import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { $PascalCaseName$Component } from './$name$.component';

describe('$PascalCaseName$Component', () => {
  let component: $PascalCaseName$Component;
  let fixture: ComponentFixture<$PascalCaseName$Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ $PascalCaseName$Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent($PascalCaseName$Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
