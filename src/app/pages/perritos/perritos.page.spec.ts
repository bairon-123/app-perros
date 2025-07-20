import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerritosPage } from './perritos.page';

describe('PerritosPage', () => {
  let component: PerritosPage;
  let fixture: ComponentFixture<PerritosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerritosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
