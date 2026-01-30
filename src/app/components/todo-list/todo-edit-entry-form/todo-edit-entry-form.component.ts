import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodoSignalsService } from '../../../services/todo-signals.service';
import { MatDialog,MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TodoHeaderComponent } from '../todo-header/todo-header.component';
import { MatTabsModule } from '@angular/material/tabs';




@Component({
    selector: 'app-todo-edit-entry-form, datepicker-custom-icon-example',
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatDialogModule],
    templateUrl: './todo-edit-entry-form.component.html',
    styleUrl: './todo-edit-entry-form.component.scss',
})
export class TodoEditEntryFormComponent {

  private todoSignalsService = inject(TodoSignalsService);
  private dialogRefService = inject(MatDialogRef<TodoHeaderComponent>)
  public allTodos = this.todoSignalsService.todosState();


   // todosSignal holds the signal of an array that contains the todos
  private todosSignal = this.todoSignalsService.todosState;
  // todosList is a computed value dependent on todosSignal's current value
  public todosList = computed(() => this.todosSignal());
  

  public todosForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    date: new FormControl('', [
      Validators.required,
    ]),
  });

  public handleCreateNewTodo(): void {
   
    if (this.todosForm.value && this.todosForm.valid) {
      const title = String(this.todosForm.controls['title'].value);
      const description = String(this.todosForm.controls['description'].value);
      const dateValue = String(this.todosForm.controls['date'].value);
      const formattedDate = new Date(dateValue + 'T00:00:00');
      const date = formattedDate.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const id =
        this.allTodos.length > 0
          ? Math.max(...this.allTodos.map((todo) => todo.id)) + 1
          : 1;

      const done = false;

         

      this.todoSignalsService.updateTodos({ id, title, description, date, done });
      this.dialogRefService.close();
    }
  }

  public handleCloseModal(): void {
    this.dialogRefService.close();
  }

  private dialogService = inject(MatDialog)

  public handleOpenModal(): void {
      this.dialogService.open(TodoEditEntryFormComponent, {
        width: '50vw',
        maxHeight: '80vh',
      })
    }

}

