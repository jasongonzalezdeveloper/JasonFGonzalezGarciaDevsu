import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from '../../services/product-service';

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
      next: (response: any) => {
        alert(response.message ?? `Producto ${this.productName} eliminado exitosamente.`);
        this.closeModalEvent.emit();
      },
      error: (error) => {
        if (error.status === 404) {
          alert(`Producto ${this.productName} no encontrado.`);
        } else {
          alert(`Error al eliminar el producto ${this.productName}.`);
        }
      }
    });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
