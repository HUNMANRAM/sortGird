import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getSortedProducts(sortBy: string, order: string): Observable<any> {
    const url = `${this.apiUrl}?sortBy=${sortBy}&order=${order}`;
    return this.http.get<any>(url);
  }
}