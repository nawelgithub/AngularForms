import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterReactifFormComponent } from './register-reactif-form.component';

describe('RegisterReactifFormComponent', () => {
  let component: RegisterReactifFormComponent;
  let fixture: ComponentFixture<RegisterReactifFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterReactifFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterReactifFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
