import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.cols = 13;
        this.rows = 14;
        this.L = 0;
        this.inner_walls = 20;
        this.walls = [];

        this.snakes = [
            new Snake({ id: 0, color: "red", r: this.rows - 2, c: 1 }, this),
            new Snake({ id: 1, color: 'blue', r: 1, c: this.cols - 2 }, this)
        ];
    }

    add_event_listener() {
        this.ctx.canvas.focus();
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === 'w') snake0.set_direction(0);
            if (e.key === 'd') snake0.set_direction(1);
            if (e.key === 's') snake0.set_direction(2);
            if (e.key === 'a') snake0.set_direction(3);
            if (e.key === 'ArrowUp') snake1.set_direction(0);
            if (e.key === 'ArrowRight') snake1.set_direction(1);
            if (e.key === 'ArrowDown') snake1.set_direction(2);
            if (e.key === 'ArrowLeft') snake1.set_direction(3);
        })
    }

    start() {
        for (let i = 0; i < 1000; i++) {
            if (this.create_walls()) {
                break;
            }
        }
        this.add_event_listener();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    render() {
        this.color_even = "#AAD751", this.color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.ctx.fillStyle = (r + c) % 2 ? this.color_odd : this.color_even;
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }

    check_connectivity(g, sx, sy, ex, ey) {
        if (sx === ex && sy === ey) {
            return true;
        }
        g[sx][sy] = true;
        const dx = [0, 0, 1, -1];
        const dy = [1, -1, 0, 0];
        for (let i = 0; i < 4; i++) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, ex, ey)) {
                return true;
            }
        }
        return false;
    }

    create_walls() {
        const g = [];
        for (let r = 0; r < this.rows; r++) {
            g[r] = [];
            for (let c = 0; c < this.cols; c++) {
                g[r][c] = false;
            }
        }

        for (let r = 0; r < this.rows; r++) {
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for (let c = 0; c < this.cols; c++) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        for (let i = 0; i < this.inner_walls / 2; i++) {
            for (let j = 0; j < 1000; j++) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) {
                    continue;
                }
                if (r === 1 && c === this.cols - 2 || r === this.rows - 2 && c === 1) {
                    continue;
                }
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) {
            return false;
        }

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }

    // 检查两条蛇是否已经准备好下一步
    check_ready() {
        for (let snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    // 两条蛇都准备好后，执行下一步
    next_step() {
        for (let snake of this.snakes) {
            snake.next_step();
        }
        this.check_win();
    }

    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    check_win() {
        const [snake0, snake1] = this.snakes;

        // 如果两条蛇都死亡，则平局
        if (snake0.status === 'die' && snake1.status === 'die') {
            return;
        }

        // 如果其中一条蛇死亡，另一条蛇获胜
        if (snake0.status === 'die') {
            snake1.status = 'win';
        } else if (snake1.status === 'die') {
            snake0.status = 'win';
        }
    }

    check_valid(cell) {
        // 撞墙
        for (const wall of this.walls) {
            if (cell.r === wall.r && cell.c === wall.c) {
                return false;
            }
        }

        // 撞蛇身
        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (cell.r === snake.cells[i].r && cell.c === snake.cells[i].c) {
                    return false;
                }
            }
        }

        return true;
    }

    destroy() {

    }
}