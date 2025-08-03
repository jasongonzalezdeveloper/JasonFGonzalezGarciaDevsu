import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from '../../../services/product-service';

@Component({
  selector: 'delete-product-modal',
  imports: [],
  templateUrl: './delete-product-modal.html',
  styleUrl: './delete-product-modal.scss'
})
export class DeleteProductModal {
  @Input()
  productId: string = "";

  @Input()
  productName: string = "";

  @Input()
  openModal: boolean = false;

  @Output() 
  closeModalEvent = new EventEmitter<void>();

  constructor(private productService: ProductService) {}

  ngOnInit() {
  }

  confirmDelete() {
    this.productService.deleteProduct(this.productId).subscribe({
      next: () => {
        alert(`Producto ${this.productName} eliminado exitosamente.`);
        this.closeModalEvent.emit();
      },
      error: () => {
        alert(`Error al eliminar el producto ${this.productName}.`);
      }
    });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
