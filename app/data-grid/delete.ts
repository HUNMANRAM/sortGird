import { Component } from '@angular/core';
import { WjGridModule, CellRangeEventArgs } from '@mescius/wijmo.angular2.grid';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [WjGridModule],
  template: `
    <wj-flex-grid 
      [itemsSource]="products" 
      [autoGenerateColumns]="false" 
      [allowSorting]="true" 
      [allowResizing]="true" 
      [isReadOnly]="false" 
      (sortedColumn)="onSortedColumn($event)"  <!-- Add Event Listener -->
      style="height: 400px; width: 100%;">
      
      <wj-flex-grid-column header="ID" binding="id" [width]="80" [allowSorting]="true"></wj-flex-grid-column>
      <wj-flex-grid-column header="Category" binding="category" width="*" [allowSorting]="true"></wj-flex-grid-column>
      <wj-flex-grid-column header="Price" binding="price" [width]="100" [allowSorting]="true"></wj-flex-grid-column>
      <wj-flex-grid-column header="Stock" binding="stock" [width]="150" [allowSorting]="true"></wj-flex-grid-column>
    </wj-flex-grid>
  `
})
export class DataGridComponent {
  products: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getProductsData(); // Load data initially
  }

  // Initial data fetch without sorting
  getProductsData(sortBy: string = 'id', sortOrder: string = 'asc') {
    this.apiService.getSortedProducts(sortBy, sortOrder).subscribe({
      next: (data) => {
        this.products = data.products;
        console.log(this.products);
      },
      error: (error) => console.error('Error fetching data:', error),
    });
  }

  // Handle sorting event from grid
  onSortedColumn(e: CellRangeEventArgs) {
    const column = e.panel.columns[e.col];
    const sortBy = column.binding; // Get the field name (e.g., 'price', 'category')
    const sortOrder = column.currentSort === '+' ? 'asc' : 'desc'; // Determine sort direction

    console.log(`Sorting by: ${sortBy}, Order: ${sortOrder}`);
    this.getProductsData(sortBy, sortOrder); // Fetch sorted data from API
  }
}
