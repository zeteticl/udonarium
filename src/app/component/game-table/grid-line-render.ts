import { GridType } from '@udonarium/game-table';

type StrokeGridFunc = (w: number, h: number, gridSize: number) => GridPosition;
type GridPosition = { gx: number, gy: number };

export class GridLineRender {
  constructor(readonly canvasElement: HTMLCanvasElement) {
  }

  private makeBrush(context: CanvasRenderingContext2D, gridSize: number, gridColor: string): CanvasRenderingContext2D {
    // 座標描画用brush設定
    context.strokeStyle = gridColor;
    context.fillStyle = context.strokeStyle;
    context.lineWidth = 1;

    let fontSize: number = Math.floor(gridSize / 5);
    context.font = `bold ${fontSize}px sans-serif`;
    context.textBaseline = 'top';
    context.textAlign = 'center';
    return context
  }

  render(width: number, height: number, gridSize: number = 50, gridType: GridType = GridType.SQUARE, gridColor: string = '#000000e6') {
    this.canvasElement.width = width * gridSize;
    this.canvasElement.height = height * gridSize;
    let context: CanvasRenderingContext2D = this.canvasElement.getContext('2d');

    if (gridType < 0) return;

    if (gridType == 3) {
      let hexGrid = initGrid(width, height);
      //console.log(hexGrid)
      drawGrid(hexGrid, this.canvasElement.width, this.canvasElement.height);
      return;
    }
    let calcGridPosition: StrokeGridFunc = this.generateCalcGridPositionFunc(gridType);
    this.makeBrush(context, gridSize, gridColor);
    for (let h = 0; h <= height; h++) {
      for (let w = 0; w <= width; w++) {
        let { gx, gy } = calcGridPosition(w, h, gridSize);
        this.strokeSquare(context, gx, gy, gridSize);
        context.fillText((w + 1).toString() + '-' + (h + 1).toString(), gx + (gridSize / 2), gy + (gridSize / 2));
      }
    }

    function HexCell(x, y, z) {
      this._x = x;
      this._y = y;
      this._z = z;
    }

    function initGrid(mapSizeWidth, mapSizeHeight) {
      mapSizeWidth = Math.max(1, Math.floor(mapSizeWidth / 2));
      mapSizeHeight = Math.max(1, Math.floor(mapSizeHeight / 2));
      let mapSizeZ = 10;
      mapSizeZ = Math.max(1, Math.max(mapSizeHeight, mapSizeWidth));
      //console.log('mapSizeWidth, mapSizeHeight', mapSizeWidth, mapSizeHeight, mapSizeZ)
      let gridArray = [];
      let cnt = 0;

      for (let i = -mapSizeWidth; i < mapSizeWidth + 1; i += 1) {
        for (let j = -mapSizeHeight; j < mapSizeHeight + 1; j += 1) {
          for (let k = -mapSizeZ; k < mapSizeZ + 1; k += 1) {
            if (i + j + k == 0) {
              gridArray.push(new HexCell(i, j, k));
              cnt += 1;
            }
          }
        }
      }

      return gridArray;
    }

    function drawGrid(gridArray, CEW, CEH) {
      let edgeLength = gridSize;
      let edgeW = edgeLength * 3 / 2;
      let edgeH = edgeLength * Math.sqrt(3) / 2;
      context.strokeStyle = gridColor;
      context.fillStyle = "rgba(255, 255, 255, 0.0)";
      context.lineWidth = 3;
      let x, y, z;
      let posX, posY;
      let centerX = CEW / 2;
      let centerY = CEH / 2;

      for (let i = 0; i < gridArray.length; i++) {
        [x, y, z] = [gridArray[i]._x, gridArray[i]._y, gridArray[i]._z];
        posX = x * edgeW + centerX;
        posY = (-y + z) * edgeH + centerY;

        context.moveTo(posX + Math.cos(0) * edgeLength,
          posY + Math.sin(0) * edgeLength);
        for (let j = 1; j <= 6; j++) {
          context.lineTo(posX + Math.cos(j / 6 * (Math.PI * 2)) * edgeLength,
            posY + Math.sin(j / 6 * (Math.PI * 2)) * edgeLength);
        }
        context.fill();
        context.stroke();
      }
    }
  }

  private generateCalcGridPositionFunc(gridType: GridType): StrokeGridFunc {
    switch (gridType) {
      case GridType.HEX_VERTICAL: // ヘクス縦揃え
        return (w, h, gridSize) => {
          if ((w % 2) === 1) {
            return { gx: w * gridSize, gy: h * gridSize };
          } else {
            return { gx: w * gridSize, gy: h * gridSize + (gridSize / 2) };
          }
        }

      case GridType.HEX_HORIZONTAL: // ヘクス横揃え(どどんとふ互換)
        return (w, h, gridSize) => {
          if ((h % 2) === 1) {
            return { gx: w * gridSize, gy: h * gridSize };
          } else {
            return { gx: w * gridSize + (gridSize / 2), gy: h * gridSize };
          }
        }

      default: // スクエア(default)
        return (w, h, gridSize) => {
          return { gx: w * gridSize, gy: h * gridSize };
        }
    }
  }

  private strokeSquare(context: CanvasRenderingContext2D, gx: number, gy: number, gridSize: number) {
    context.beginPath();
    context.strokeRect(gx, gy, gridSize, gridSize);
  }

  private strokeHex(context: CanvasRenderingContext2D, gx: number, gy: number, gridSize: number, gridType: GridType) {
    let deg = gridType === GridType.HEX_HORIZONTAL ? -30 : 0;
    let radius = gridSize / Math.sqrt(3);
    let cx = gx + gridSize / 2;
    let cy = gy + gridSize / 2;

    context.beginPath();
    for (let i = 0; i < 6; i++) {
      deg += 60;
      let radian = Math.PI / 180 * deg;
      let x = Math.cos(radian) * radius + cx;
      let y = Math.sin(radian) * radius + cy;
      context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();
  }
}
