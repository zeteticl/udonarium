import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextNoteInventoryComponent } from './text-note-inventory.component';

describe('TextNoteInventoryComponent', () => {
  let component: TextNoteInventoryComponent;
  let fixture: ComponentFixture<TextNoteInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextNoteInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextNoteInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
