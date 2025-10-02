import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

@Component({
  selector: 'app-form-user',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUserForEdit();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20), Validators.pattern(/^[0-9+#\s\-\(\)]+$/)]],
      website: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        suite: ['', [Validators.required]],
        city: ['', [Validators.required]],
        zipcode: ['', [Validators.required]],
        geo: this.fb.group({
          lat: ['', [Validators.required]],
          lng: ['', [Validators.required]]
        })
      }),
      company: this.fb.group({
        name: ['', [Validators.required]],
        catchPhrase: ['', [Validators.required]],
        bs: ['', [Validators.required]]
      })
    });
  }

  private loadUserForEdit() {
    this.isLoading = true;
    const users = this.getUsersFromStorage();
    const user = users.find(u => u.id === this.userId);
    
    if (user) {
      this.userForm.patchValue(user);
      this.isLoading = false;
    } else {
      console.error('User not found');
      this.router.navigate(['/users']);
    }
  }

  private getUsersFromStorage(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private saveUsersToStorage(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private getNextId(): number {
    const users = this.getUsersFromStorage();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSaving = true;
      
      const users = this.getUsersFromStorage();
      const formValue = this.userForm.value;

      if (this.isEditMode && this.userId) {
        // Update existing user
        const userIndex = users.findIndex(u => u.id === this.userId);
        if (userIndex !== -1) {
          users[userIndex] = { ...formValue, id: this.userId };
          this.saveUsersToStorage(users);
          console.log('User updated successfully');
        }
      } else {
        // Create new user
        const newUser: User = {
          ...formValue,
          id: this.getNextId()
        };
        users.push(newUser);
        this.saveUsersToStorage(users);
        console.log('User created successfully');
      }

      this.isSaving = false;
      this.router.navigate(['/users']);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          const nestedControl = control.get(nestedKey);
          nestedControl?.markAsTouched();
          
          if (nestedControl instanceof FormGroup) {
            Object.keys(nestedControl.controls).forEach(deepKey => {
              nestedControl.get(deepKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.userForm.get(`${groupName}.${fieldName}`);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isDeepFieldInvalid(groupName: string, nestedGroup: string, fieldName: string): boolean {
    const field = this.userForm.get(`${groupName}.${nestedGroup}.${fieldName}`);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        if (fieldName === 'phone') {
          return `El teléfono debe tener al menos ${requiredLength} dígitos`;
        }
        return `Mínimo ${requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        if (fieldName === 'phone') {
          return `El teléfono no puede exceder ${maxLength} dígitos`;
        }
        return `Máximo ${maxLength} caracteres`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phone') {
          return 'Solo se permiten números, +, #, espacios, guiones y paréntesis';
        }
        return 'Formato inválido';
      }
    }
    return '';
  }

  getNestedFieldError(groupName: string, fieldName: string): string {
    const field = this.userForm.get(`${groupName}.${fieldName}`);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${requiredLength} caracteres`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    return '';
  }

  getDeepFieldError(groupName: string, nestedGroup: string, fieldName: string): string {
    const field = this.userForm.get(`${groupName}.${nestedGroup}.${fieldName}`);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
    }
    return '';
  }

  cancel() {
    this.router.navigate(['/users']);
  }

  // Text formatting methods
  formatTitleCase(event: any, fieldName: string) {
    const value = event.target.value;
    const formattedValue = this.toTitleCase(value);
    if (value !== formattedValue) {
      this.userForm.get(fieldName)?.setValue(formattedValue, { emitEvent: false });
      this.showFormattingFeedback(event.target);
    }
  }

  formatAddressField(event: any, groupName: string, fieldName: string) {
    const value = event.target.value;
    const formattedValue = this.toTitleCase(value);
    if (value !== formattedValue) {
      this.userForm.get(`${groupName}.${fieldName}`)?.setValue(formattedValue, { emitEvent: false });
      this.showFormattingFeedback(event.target);
    }
  }

  formatCompanyName(event: any) {
    const value = event.target.value;
    const formattedValue = value.toUpperCase();
    if (value !== formattedValue) {
      this.userForm.get('company.name')?.setValue(formattedValue, { emitEvent: false });
      this.showFormattingFeedback(event.target);
    }
  }

  private toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  private showFormattingFeedback(element: HTMLElement) {
    element.classList.add('formatting');
    element.setAttribute('data-formatted', 'true');
    
    setTimeout(() => {
      element.classList.remove('formatting');
    }, 1000);
  }

  // Phone input validation - only allow numbers, +, #, spaces, hyphens and parentheses
  onPhoneInput(event: any) {
    const input = event.target;
    const value = input.value;
    
    // Remove any characters that are not allowed
    const filteredValue = value.replace(/[^0-9+#\s\-\(\)]/g, '');
    
    // Update the input value if it was filtered
    if (value !== filteredValue) {
      input.value = filteredValue;
      this.userForm.get('phone')?.setValue(filteredValue, { emitEvent: false });
    }
  }

  // Prevent invalid characters from being typed
  onPhoneKeyPress(event: KeyboardEvent) {
    const allowedChars = /[0-9+#\s\-\(\)]/;
    const key = event.key;
    
    // Allow special keys (backspace, delete, tab, escape, enter, etc.)
    if (event.ctrlKey || event.metaKey || event.altKey || 
        key === 'Backspace' || key === 'Delete' || key === 'Tab' || 
        key === 'Escape' || key === 'Enter' || key === 'ArrowLeft' || 
        key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      return;
    }
    
    // Block invalid characters
    if (!allowedChars.test(key)) {
      event.preventDefault();
    }
  }
}
