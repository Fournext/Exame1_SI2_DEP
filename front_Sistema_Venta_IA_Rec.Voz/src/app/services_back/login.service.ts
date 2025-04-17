import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Usuario } from '../../interface/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private myAppUrl: String;
  private myApiUrl: String;

  
  constructor(private http: HttpClient,private toastr: ToastrService) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/usuario';
   }

  login(user: Usuario):Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/login`,user);
  }
  register(user: Usuario):Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/register`,user);
  }
  getUser(id: number):Observable<Usuario> {
    return this.http.get<Usuario>(`${this.myAppUrl}${this.myApiUrl}/getUser/${id}`,{});
  }

  public getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          return payload.id; 
        } catch (error) {
          this.toastr.error('No se pudo decodificar el token.', 'Error');
          return null;
        }
      } else {
        this.toastr.error('El token no tiene el formato esperado.', 'Error');
        return null;
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.', 'Error');
      return null;
    }
  }
  
  
}
