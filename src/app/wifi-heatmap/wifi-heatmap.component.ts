// wifi-heatmap.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {LocalApiService} from '../local/service/api/local-api.service';
import {Local} from '../local/model/local';
import {buildUsuarioAuth, UsuarioAuth} from '../auth/model/usuario-auth';
import {AuthStateService} from '../auth/service/state/auth.state.service';
import {MenuComponent} from '../menu/menu.component';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

@Component({
  selector: 'app-wifi-heatmap',
  templateUrl: './wifi-heatmap.component.html',
  styleUrls: ['./wifi-heatmap.component.css'],
  imports: [FormsModule, NgForOf, ButtonDirective, MenuComponent, PanelModule, CardModule],
  standalone: true
})
export class WifiHeatmapComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  ctx!: CanvasRenderingContext2D;

  protected usuario: UsuarioAuth = buildUsuarioAuth();

  canvasWidth = 800;
  canvasHeight = 500;

  mode: 'addRoom' | 'addWifi' | null = null;
  isDrawing = false;
  availableRooms: string[] = [];
  selectedRoom: string | null = null;
  rooms: Room[] = [];
  wifiLocation: { x: number; y: number } | null = null;

  tempStartX = 0;
  tempStartY = 0;

  constructor(
    private localApi: LocalApiService,
    private auth: AuthStateService

  ) {
    this.auth.usuario.subscribe(usuario => this.usuario = usuario);

    this.localApi.buscarTodosPorUsuario(this.usuario.usuarioId).subscribe(
      {
        next: (local: Local[]) => {
          local.forEach((l) => this.availableRooms.push(l.nome))
        }
      }
    )
  }

  ngOnInit(): void {
    const canvasEl = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = canvasEl.getContext('2d')!;
    this.renderCanvas();
  }

  setMode(mode: 'addRoom' | 'addWifi'): void {
    this.mode = mode;
  }

  startAction(event: MouseEvent): void {
    if (!this.mode || this.mode === 'addWifi') {
      return;
    }
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    this.tempStartX = event.clientX - rect.left;
    this.tempStartY = event.clientY - rect.top;
    this.isDrawing = true;
  }

  endAction(event: MouseEvent): void {
    if (!this.mode) return;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.mode === 'addRoom' && this.isDrawing) {
      this.isDrawing = false;
      const width = x - this.tempStartX;
      const height = y - this.tempStartY;

      if (this.selectedRoom) {
        this.rooms.push({
          x: this.tempStartX,
          y: this.tempStartY,
          width,
          height,
          name: this.selectedRoom
        });
        this.availableRooms = this.availableRooms.filter(r => r !== this.selectedRoom);
        this.selectedRoom = null;
      }

    } else if (this.mode === 'addWifi') {
      this.wifiLocation = { x, y };
      this.mode = null;
    }

    this.renderCanvas();
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || this.mode !== 'addRoom') return;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    // Redesenha tudo e mostra o retângulo “dinâmico” que o usuário está criando
    this.renderCanvas();
    this.ctx.strokeStyle = this.selectedRoom ? 'blue' : 'gray';
    this.ctx.strokeRect(
      this.tempStartX,
      this.tempStartY,
      currentX - this.tempStartX,
      currentY - this.tempStartY
    );
  }

  renderCanvas(): void {
    // Limpa o canvas
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Desenha cada cômodo
    this.rooms.forEach(room => {
      // cor de fundo do cômodo
      this.ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
      this.ctx.fillRect(room.x, room.y, room.width, room.height);

      // nome do cômodo no centro
      this.ctx.fillStyle = 'black';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2);
    });

    // Desenha as bordas de cada cômodo (ex.: a mesma lógica de ocultar partes sobrepostas pode ser adaptada aqui)
    this.drawAllRoomBorders();

    // Caso tenhamos um Wi-Fi, desenha o ponto e depois o gradiente só sobre os cômodos
    if (this.wifiLocation) {
      // Desenha o ponto vermelhinho do Wi-Fi
      this.ctx.beginPath();
      this.ctx.arc(this.wifiLocation.x, this.wifiLocation.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = 'red';
      this.ctx.fill();

      // Desenha o gradiente “recortando” para que apareça apenas nos cômodos
      this.drawClippedHeatmap();
    }
  }

  private drawClippedHeatmap(): void {
    if (!this.wifiLocation) return;

    // Cria o gradiente radial
    const radius = 300;
    const grad = this.ctx.createRadialGradient(
      this.wifiLocation.x, this.wifiLocation.y, 0,
      this.wifiLocation.x, this.wifiLocation.y, radius
    );
    grad.addColorStop(0, 'rgba(0, 255, 0, 0.5)');
    grad.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)');
    grad.addColorStop(1, 'rgba(255, 0, 0, 0.1)');

    // Salva o estado do contexto
    this.ctx.save();

    // Inicia um caminho que une todos os cômodos
    this.ctx.beginPath();
    this.rooms.forEach(room => {
      this.ctx.rect(room.x, room.y, room.width, room.height);
    });

    // Faz o clipping para que o desenho só apareça dentro dos retângulos
    this.ctx.clip();

    // Preenche o gradiente dentro do clipping
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Restaura o contexto para desfazer o clipping
    this.ctx.restore();
  }

  /**
   * Exemplo simples de como desenhar as bordas de cada cômodo.
   * Caso preciso, adapte para remover bordas sobrepostas.
   */
  private drawAllRoomBorders(): void {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;

    this.rooms.forEach(room => {
      this.ctx.strokeRect(room.x, room.y, room.width, room.height);
    });
  }
}
