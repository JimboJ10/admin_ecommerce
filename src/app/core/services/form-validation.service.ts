import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  // Validador personalizado para URLs
  urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(control.value) ? null : { invalidUrl: true };
  }

  // Validador personalizado para teléfonos
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phonePattern.test(control.value) ? null : { invalidPhone: true };
  }

  // Validador para comparar contraseñas
  passwordMatchValidator(passwordField: string, confirmPasswordField: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) return null;

      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  // Validador para SKU único
  skuValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const skuPattern = /^[A-Z0-9\-]{6,20}$/;
    return skuPattern.test(control.value) ? null : { invalidSku: true };
  }

  // Obtener mensajes de error personalizados
  getErrorMessage(fieldName: string, errors: ValidationErrors | null): string {
    if (!errors) return '';

    if (errors['required']) {
      return `El campo ${fieldName} es requerido`;
    }
    if (errors['email']) {
      return 'Ingresa un email válido';
    }
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    if (errors['min']) {
      return `El valor mínimo es ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `El valor máximo es ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return 'El formato no es válido';
    }
    if (errors['invalidUrl']) {
      return 'Ingresa una URL válida';
    }
    if (errors['invalidPhone']) {
      return 'Ingresa un teléfono válido';
    }
    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }
    if (errors['invalidSku']) {
      return 'El SKU debe tener entre 6-20 caracteres (A-Z, 0-9, -)';
    }

    return 'Campo inválido';
  }

  // Marcar todos los campos como tocados
  markAllFieldsAsTouched(formGroup: AbstractControl) {
    Object.keys((formGroup as any).controls).forEach(key => {
      const control = (formGroup as any).get(key);
      control.markAsTouched();

      if (control.controls) {
        this.markAllFieldsAsTouched(control);
      }
    });
  }
}