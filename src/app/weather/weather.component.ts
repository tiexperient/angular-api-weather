import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var feather: any;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css', './weather-responsive.component.css']
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  forecastData: any[] = [];
  forecastDataNext3Days: any[] = []; // Array para os 3 próximos dias
  city: string = 'Brasília, BR';
  apiKey: string = 'eb5f9c09ff593b5e2a56893d399bf0a8';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWeather();
  }

  getWeather() {
    this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${this.apiKey}`)
      .subscribe((data: any) => {
        this.weatherData = data.list[0]; // Pegando o primeiro item para o clima atual
        this.forecastData = this.filterForecastData(data.list);
        this.forecastDataNext3Days = this.filterForecastDataNext3Days(data.list); // Obtendo os próximos 3 dias
        setTimeout(() => feather.replace(), 100); // Substitui os ícones
      });
  }

  filterForecastData(data: any[]): any[] {
    const forecastDays: any[] = [];
    let lastDate: string | null = null;
    const today = new Date().toLocaleDateString('pt-BR'); // Data de hoje para comparar

    for (const item of data) {
      const forecastDate = new Date(item.dt * 1000);
      const formattedDate = forecastDate.toLocaleDateString('pt-BR');

      // Ignorar previsões do dia atual
      if (formattedDate === today) {
        continue;
      }

      // Pegar apenas a primeira previsão de cada dia
      if (lastDate !== formattedDate) {
        forecastDays.push(item);
        lastDate = formattedDate;
      }

      // Parar após coletar 4 dias de previsão
      if (forecastDays.length === 4) break;
    }

    return forecastDays;
  }

  // Função para filtrar os próximos 3 dias
  filterForecastDataNext3Days(data: any[]): any[] {
    const forecastDays: any[] = [];
    let lastDate: string | null = null;
    const today = new Date().toLocaleDateString('pt-BR'); // Data de hoje para comparar

    for (const item of data) {
      const forecastDate = new Date(item.dt * 1000);
      const formattedDate = forecastDate.toLocaleDateString('pt-BR');

      // Ignorar previsões do dia atual
      if (formattedDate === today) {
        continue;
      }

      // Pegar apenas a primeira previsão de cada dia
      if (lastDate !== formattedDate) {
        forecastDays.push(item);
        lastDate = formattedDate;
      }

      // Parar após coletar 3 dias de previsão
      if (forecastDays.length === 3) break;
    }

    return forecastDays;
  }

  // Função para obter os próximos 4 dias da semana em português
  getNextDays(): string[] {
    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const today = new Date();
    const nextDays: string[] = [];

    for (let i = 1; i <= 4; i++) {
      let nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i); // Ajusta para o próximo dia
      nextDays.push(daysOfWeek[nextDay.getDay()]);
    }

    return nextDays;
  }

  getWeatherIcon(description: string): string {
    description = description.toLowerCase();
    if (description.includes('thunderstorm')) return 'cloud-lightning';
    if (description.includes('drizzle')) return 'cloud-drizzle';
    if (description.includes('rain')) return 'cloud-rain';
    if (description.includes('snow')) return 'cloud-snow';
    if (description.includes('cloud')) return 'cloud';
    if (description.includes('mist') || description.includes('fog')) return 'cloud-fog';
    return 'sun';
  }

  translateWeather(description: string): string {
    const translations: { [key: string]: string } = {
      'clear sky': 'Céu limpo',
      'few clouds': 'Poucas nuvens',
      'scattered clouds': 'Nuvens dispersas',
      'broken clouds': 'Nuvens quebradas',
      'shower rain': 'Chuva passageira',
      'rain': 'Chuva',
      'thunderstorm': 'Tempestade',
      'snow': 'Neve',
      'mist': 'Névoa',
      'light rain': 'Chuva leve',
    };
    return translations[description.toLowerCase()] || description;
  }

  getBackgroundImage(): string {
    if (!this.weatherData) return 'assets/brasilia2.png';

    const description = this.weatherData.weather[0].description.toLowerCase();

    if (description.includes('clear')) return 'assets/brasilia4.png';
    if (description.includes('cloud')) return 'assets/brasilia1.jpg';
    if (description.includes('rain')) return 'assets/brasilia3.jpg';
    if (description.includes('storm')) return 'assets/brasilia2.png';

    return 'assets/brasilia2.png'; // Imagem padrão
  }
}