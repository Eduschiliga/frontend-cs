import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-wifi-heatmap',
  templateUrl: './wifi-heatmap.component.html',
  styleUrls: ['./wifi-heatmap.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    ButtonDirective
  ]
})
export class WifiHeatmapComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  ctx!: CanvasRenderingContext2D;

  // Configurações do Canvas
  canvasWidth: number = 800;
  canvasHeight: number = 500;

  // Estado de controle
  mode: 'addRoom' | 'addWifi' | null = null; // Modo atual
  isDrawing: boolean = false;

  // Lista de cômodos disponíveis e seleção
  availableRooms: string[] = ['sala', 'cozinha', 'banheiro'];
  selectedRoom: string | null = null; // Cômodo atualmente selecionado

  rooms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
  }> = []; // Cômodos desenhados

  wifiLocation: { x: number; y: number } | null = null; // Localização do roteador

  tempStartX: number = 0; // Coordenadas temporárias para o início do desenho
  tempStartY: number = 0;

  ngOnInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d')!;
    this.renderCanvas(); // Renderização inicial
  }

  /** Muda o estado atual (modo de inserção) */
  setMode(mode: 'addRoom' | 'addWifi'): void {
    this.mode = mode;
  }

  /** Início de uma ação (desenho do cômodo ou Wi-Fi) */
  startAction(event: MouseEvent): void {
    if (!this.mode || this.mode === 'addWifi') return;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    this.tempStartX = event.clientX - rect.left;
    this.tempStartY = event.clientY - rect.top;
    this.isDrawing = true;
  }

  /** Finaliza a ação (desenhar cômodo ou definir Wi-Fi) */
  endAction(event: MouseEvent): void {
    if (!this.mode) return;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.mode === 'addRoom' && this.isDrawing) {
      this.isDrawing = false;

      // Calcula as dimensões do cômodo
      const width = x - this.tempStartX;
      const height = y - this.tempStartY;

      // Verifica sobreposição
      const overlaps = this.checkOverlap(
        this.tempStartX,
        this.tempStartY,
        width,
        height
      );

      if (overlaps) {
        alert('Não é possível adicionar o cômodo aqui. Ele está sobreposto!');
        return;
      }

      // Adiciona o cômodo selecionado
      if (this.selectedRoom) {
        this.rooms.push({
          x: this.tempStartX,
          y: this.tempStartY,
          width,
          height,
          name: this.selectedRoom,
        });

        // Remove o cômodo da lista de disponíveis
        this.availableRooms = this.availableRooms.filter(
          (room) => room !== this.selectedRoom
        );
        this.selectedRoom = null; // Reseta a seleção
        this.renderCanvas();
      }
    } else if (this.mode === 'addWifi') {
      this.wifiLocation = { x, y };
      this.mode = null; // Sai do modo Wi-Fi
      this.renderCanvas();
      this.drawHeatmap();
    }
  }

  /** Verifica se o novo cômodo está sobreposto a algum outro */
  checkOverlap(x: number, y: number, width: number, height: number): boolean {
    return this.rooms.some((room) => {
      return !(
        x + width <= room.x || // Lado direito do novo fica antes do lado esquerdo do existente
        y + height <= room.y || // Base do novo fica acima do topo do existente
        x >= room.x + room.width || // Lado esquerdo do novo fica após o lado direito do existente
        y >= room.y + room.height // Topo do novo fica abaixo da base do existente
      );
    });
  }

  /** Desenho dinâmico ao mover o mouse */
  draw(event: MouseEvent): void {
    if (!this.isDrawing || this.mode !== 'addRoom') return;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    this.renderCanvas();

    // Desenha o cômodo temporário
    this.ctx.strokeStyle = this.selectedRoom ? 'blue' : 'gray';
    this.ctx.strokeRect(
      this.tempStartX,
      this.tempStartY,
      currentX - this.tempStartX,
      currentY - this.tempStartY
    );
  }

  /** Renderiza todos os elementos no canvas */
  renderCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Desenha todos os cômodos
    this.rooms.forEach((room) => {
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(room.x, room.y, room.width, room.height);
      this.ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
      this.ctx.fillRect(room.x, room.y, room.width, room.height);

      // Escreve o nome do cômodo
      this.ctx.fillStyle = 'black';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        room.name,
        room.x + room.width / 2,
        room.y + room.height / 2
      );
    });

    // Desenha o Wi-Fi
    if (this.wifiLocation) {
      this.ctx.beginPath();
      this.ctx.arc(this.wifiLocation.x, this.wifiLocation.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = 'red';
      this.ctx.fill();
    }
  }

  /** Adiciona o mapa de calor */
  drawHeatmap(): void {
    if (!this.wifiLocation) return;

    const grad = this.ctx.createRadialGradient(
      this.wifiLocation.x,
      this.wifiLocation.y,
      0,
      this.wifiLocation.x,
      this.wifiLocation.y,
      300
    );

    grad.addColorStop(0, 'rgba(0, 255, 0, 0.5)');
    grad.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)');
    grad.addColorStop(1, 'rgba(255, 0, 0, 0.1)');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
