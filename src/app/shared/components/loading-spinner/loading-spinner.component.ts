import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] ' + (show ? '' : 'hidden')">
      <div class="bg-white rounded-2xl p-8 shadow-2xl">
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p class="text-slate-700 font-semibold">{{ message }}</p>
        </div>
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Cargando...';
}