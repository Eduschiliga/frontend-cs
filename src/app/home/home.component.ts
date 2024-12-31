import {Component, OnInit} from '@angular/core';
import {Local} from '../local/model/local';
import {LocalApiService} from '../local/service/api/local-api.service';
import {LocalStateService} from '../local/service/state/local-state.service';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {ChartOptions} from 'chart.js';
import {Medicao} from '../medicao/model/medicao';
import {ToolbarModule} from 'primeng/toolbar';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-home',
  imports: [
    ChartModule,
    CardModule,
    ToolbarModule,
    MenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  protected locais: Local[] = [];

  protected qtdLocal = '';
  protected qtdMedicao = 0;

  protected mediaInterferencia = 0;

  protected mediaNivelSinal2ghz = 0;
  protected mediaNivelSinal5ghz = 0;

  protected mediaVelocidade5ghz = 0;
  protected mediaVelocidade2ghz = 0;

  protected chartDataVelocidade5ghz: any = null;
  protected chartDataVelocidade24ghz: any = null;
  protected chartDataNivelSinal5ghz: any = null;
  protected chartDataInterferencia: any = null;

  chartOptions: ChartOptions = {};

  constructor(
    private localApi: LocalApiService,
    private localState: LocalStateService,
  ) {
    this.localState.local$.subscribe(
      {
        next: (local: Local[]) => {
          this.locais = local;

          this.qtdLocal = this.locais.length.toString();

          this.locais.forEach(l => {
            this.qtdMedicao += l.medicoes.length;

            this.mediaInterferencia += l.medicoes.map(m => m.interferencia).reduce((a, b) => a + b, 0);

            this.mediaNivelSinal2ghz += l.medicoes.map(m => m.nivel_sinal_24ghz).reduce((a, b) => a + b, 0);
            this.mediaNivelSinal5ghz += l.medicoes.map(m => m.nivel_sinal_5ghz).reduce((a, b) => a + b, 0);

            this.mediaVelocidade2ghz += l.medicoes.map(m => m.velocidade_24ghz).reduce((a, b) => a + b, 0);
            this.mediaVelocidade5ghz += l.medicoes.map(m => m.velocidade_5ghz).reduce((a, b) => a + b, 0);

            if (this.qtdMedicao > 0) {
              this.mediaInterferencia = parseFloat((this.mediaInterferencia / this.qtdMedicao).toFixed(2));
              this.mediaNivelSinal2ghz = parseFloat((this.mediaNivelSinal2ghz / this.qtdMedicao).toFixed(2));
              this.mediaNivelSinal5ghz = parseFloat((this.mediaNivelSinal5ghz / this.qtdMedicao).toFixed(2));
              this.mediaVelocidade2ghz = parseFloat((this.mediaVelocidade2ghz / this.qtdMedicao).toFixed(2));
              this.mediaVelocidade5ghz = parseFloat((this.mediaVelocidade5ghz / this.qtdMedicao).toFixed(2));
            }

            this.configureCharts();
          })

        }
      }
    )
  }

  ngOnInit(): void {
    this.localApi.buscarTodosPorUsuario(1).subscribe(
      {
        next: (local: Local[]) => {
          this.localState.setLocalList(local);
        }
      }
    )
  }

  configureCharts() {
    const labelsSet = new Set<string>();
    this.locais.forEach(local => {
      local.medicoes.forEach(medicao => {
        const date = new Date(medicao.data);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // Formato "dd/mm/aaaa"
        labelsSet.add(formattedDate);
      });
    });

    const labels = Array.from(labelsSet).sort((a, b) => {
      const date1 = a.split('/').reverse().join('-');
      const date2 = b.split('/').reverse().join('-');
      return new Date(date1).getTime() - new Date(date2).getTime();
    });

    this.chartDataVelocidade5ghz = this.createChartData(labels, 'velocidade_5ghz');
    this.chartDataVelocidade24ghz = this.createChartData(labels, 'velocidade_24ghz');
    this.chartDataNivelSinal5ghz = this.createChartData(labels, 'nivel_sinal_5ghz');
    this.chartDataInterferencia = this.createChartData(labels, 'interferencia');

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };
  }

  createChartData(labels: string[], property: keyof Medicao) {
    const datasets = this.locais.map(local => ({
      label: local.nome,
      data: labels.map(label => {
        const matchingMedicao = local.medicoes.find(medicao => {
          const medicaoDate = new Date(medicao.data);
          const formattedDate = `${medicaoDate.getDate()}/${medicaoDate.getMonth() + 1}/${medicaoDate.getFullYear()}`;
          return formattedDate === label;
        });
        return matchingMedicao ? matchingMedicao[property] : null;
      }),
      backgroundColor: this.getRandomColor(),
      borderColor: this.getRandomColor(),
      borderWidth: 2
    }));

    return {
      labels,
      datasets
    };
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
