import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super();
        this.gamemap = gamemap;
        this.color = info.color;
        this.id = info.id;

        this.cells = [new Cell(info.r, info.c)]; // 蛇身数组
        this.status = 'idle'; // idle表示原地不动 move表示移动 die表示死亡 win代表胜利
        this.speed = 5; // 表示每秒走5格
        this.direction = -1; // 表示蛇的方向：-1表示，没有指令；0表示向上，1表示向右，2表示向下，3表示向左
        this.next_cell = null; // 表示目标格子
        this.dr = [-1, 0, 1, 0]; // 行方向移动
        this.dc = [0, 1, 0, -1]; // 列方向移动
        this.step = 0; // 表示蛇的步数
        this.eps = 1e-2; // 浮点数误差

        // 设置初始眼睛方向
        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;
        this.eye_dx = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
    }

    set_direction(d) {
        this.direction = d; // 设置方向
        // 测试能否正确接收键盘输入方向 -- success
        // console.log(d);
    }

    start() {

    }

    render() {
        const ctx = this.gamemap.ctx;
        const L = this.gamemap.L;

        ctx.fillStyle = this.color;
        if (this.status === 'die') {
            ctx.fillStyle = 'white';
        }

        // 渲染蛇的移动图形
        for (let cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, 2 * Math.PI);
            ctx.fill();
        }

        // 为使移动连贯，在两个圆形之间添加矩形
        for (let i = 1; i < this.cells.length; i++) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else if (Math.abs(a.y - b.y) < this.eps) {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        // 画眼睛
        ctx.fillStyle = 'black';

        if (this.status === 'die') {
            // 死亡时画×
            for (let i = 0; i < 2; i++) {
                const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
                const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
                const eye_size = L / 15;

                ctx.beginPath();
                // 画×的第一条线
                ctx.moveTo(eye_x - eye_size, eye_y - eye_size);
                ctx.lineTo(eye_x + eye_size, eye_y + eye_size);
                // 画×的第二条线
                ctx.moveTo(eye_x + eye_size, eye_y - eye_size);
                ctx.lineTo(eye_x - eye_size, eye_y + eye_size);
                ctx.stroke();
            }
        } else if (this.status === 'win') {
            // 胜利时画^^，根据eye_direction旋转
            for (let i = 0; i < 2; i++) {
                const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
                const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
                const eye_size = L / 15;

                ctx.beginPath();
                // 根据eye_direction旋转^^
                ctx.save(); // 保存当前画布状态
                ctx.translate(eye_x, eye_y); // 移动原点到眼睛位置
                ctx.rotate(this.eye_direction * Math.PI / 2); // 根据eye_direction旋转

                // 画^
                ctx.moveTo(-eye_size, 0);
                ctx.lineTo(0, -eye_size);
                ctx.lineTo(eye_size, 0);

                ctx.restore(); // 恢复画布状态
                ctx.stroke();
            }
        }
        else {
            for (let i = 0; i < 2; i++) {
                const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
                const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
                ctx.beginPath();
                ctx.arc(eye_x, eye_y, L / 15, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    // 判断是否需要增加蛇尾，如果不需要(false)就说明需要移动，否则(true)就原地不动
    check_tail_increasing() {
        if (this.step <= 10) return true;
        if (this.step % 3 === 1) return true;
        return false;
    }

    update_move() {
        // 测试头部移动 -- success
        // this.cells[0].x += this.speed * this.time_delta / 1000;
        const move_distance = this.speed * this.time_delta / 1000; // 移动距离
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy); // 目标距离
        if (distance < this.eps) {
            this.cells[0] = this.next_cell;
            this.next_cell = null;
            this.status = 'idle';

            if (!this.check_tail_increasing()) {
                this.cells.pop();
            }
        } else {
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            if (!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    next_step() {
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.status = 'move';
        this.step++;
        this.direction = -1; // 重置方向
        this.eye_direction = d; // 重置眼睛方向
        const k = this.cells.length;
        for (let i = k; i > 0; i--) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }
        // 注意：返回false表示死亡
        if (!this.gamemap.check_valid(this.next_cell)) {
            this.status = 'die';
        }
    }

    update() {
        this.render();
        if (this.status === 'move') {
            this.update_move();
        }
    }

    destroy() {

    }
}