import { Component, ViewChild } from '@angular/core';
import { WjGridModule, WjFlexGrid,  } from '@grapecity/wijmo.angular2.grid';
import { CellRangeEventArgs, FormatItemEventArgs } from '@grapecity/wijmo.grid';


import { ApiService } from '../api.service';
import { CollectionView, SortDescription } from '@grapecity/wijmo';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [WjGridModule],
  templateUrl: 'data-grid.component.html'
   
})
export class DataGridComponent {
  @ViewChild('flexGrid') flexGrid!: WjFlexGrid;
  collectionView: CollectionView;

  constructor(private apiService: ApiService) {
    this.collectionView = new CollectionView<any>([]);
  }

  ngOnInit() {
    this.getProductsData(); // Initial data fetch
  }

  getProductsData(sortBy: string = 'title', order: string = 'asc') {
    this.apiService.getSortedProducts(sortBy, order).subscribe({
      next: (data) => {
        this.collectionView.sourceCollection = data.products;
      },
      error: (error) => console.error('Error fetching data:', error),
    });
  }

  onSortingColumn(event: CellRangeEventArgs) {
    event.cancel = true; // Cancel default sorting

    const column = this.flexGrid.columns[event.col];
    const sortBy = column.binding || '';
    const sortDescriptions = this.collectionView.sortDescriptions;
    const currentSort = sortDescriptions.find((sd: SortDescription) => sd.property === sortBy);
    const sortOrder = currentSort && currentSort.ascending ? 'desc' : 'asc';

    sortDescriptions.clear();
    sortDescriptions.push(new SortDescription(sortBy, sortOrder === 'asc'));

    this.getProductsData(sortBy, sortOrder); // Server-side sorting
  }

  onFormatItem(event: FormatItemEventArgs) {
    if (event.panel === this.flexGrid.columnHeaders) {
      const col = event.panel.columns[event.col];
      const sortDescriptions = this.collectionView.sortDescriptions;
      const currentSort = sortDescriptions.find((sd: SortDescription) => sd.property === col.binding);

      event.cell.textContent = col.header; // Clear existing content

      if (currentSort) {
        const sortIcon = document.createElement('img');
        sortIcon.src = currentSort.ascending ? 'assets/sort.png' : 'assets/sortone.png';
        sortIcon.classList.add('sort-icon');
        event.cell.appendChild(sortIcon);
      }
    }
  }

  onGridInitialized() {
    this.flexGrid.hostElement.classList.add('custom-grid');
  }
}
